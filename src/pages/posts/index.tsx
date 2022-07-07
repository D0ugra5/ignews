import { GetStaticProps } from 'next';
import { getPrismicClient } from './../../services/prismic';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom'

import Head from 'next/head';
import styles from './styles.module.scss';


type Post = {
    title: string;
    slug: string;
    excerpt: string;
    updateAt: string;
}

interface PostsProps {
    posts: [Post];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | ignews</title>
            </ Head>
            <main className={styles.container}>
                <div className={styles.posts}>

                    {posts.map(post => (
                        <a key={post.slug} href="">
                            <time>{post.updateAt}</time>
                            <strong>{post.title}</strong>
                            <p>{post.excerpt}</p>
                        </a>
                    ))}
                </div>
            </main>
        </>
    );
}



export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const response = await prismic.query([
        Prismic.predicate.at('document.type', 'post')
    ], {
        fetch: ['publication,title', 'publication.content'],
        pageSize: 100,
    });
    console.log(JSON.stringify(response, null, 2));

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find((content: any) => content.type === 'paragraph')?.text ?? '',
            updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
        }
    })

    return {
        props: { posts }
    }
}