
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import Head from 'next/head';


import styles from './post.module.scss';

interface PostProps {
    post: {
        title: string,
        slug: string,
        content: string,
        updateAt: string
    }
}



export default function Post({ post }: PostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req });
    console.log(session)
    if (!session?.userActiveSubscription) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const { slug } = params as any;



    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post', slug, {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-br', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }),
    }

    return {
        props: {
            post
        },

    }
}