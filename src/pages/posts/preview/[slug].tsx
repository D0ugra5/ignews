
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPrismicClient } from '../../../services/prismic';
import { RichText } from 'prismic-dom';
import Head from 'next/head';


import styles from '../post.module.scss';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface PostProps {
    post: {
        title: string,
        slug: string,
        content: string,
        updateAt: string
    }
}



export default function PostPreview({ post }: PostProps) {
    const router = useRouter();
    const { data } = useSession();
    useEffect(() => {
        if (data?.userActiveSubscription) {
            router.push(`/posts/${post.slug}`);
        }
    }, [data]);
    return (
        <>
            <Head>
                <title>{post.title} | ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
                <div className={styles.continueReading}>
                    Wanna continue reading?
                    <Link href="/">
                        <a >Subscribe Now 😇</a>
                    </Link>
                </div>
            </main>
        </>
    )
}
export const getStaticPaths : GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params as any;
    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post', slug, {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
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
        revalidate: 60 * 30

    }
}