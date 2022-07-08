import { GetStaticProps } from 'next';
import { getPrismicClient } from './../../services/prismic';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom'

import Head from 'next/head';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useSession } from 'next-auth/react';


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
    const { data } = useSession();
    function handleDirect(slug: string): string {

        if (data?.userActiveSubscription && data?.user) {
            return `/posts/${slug}`;
        } else {
            return `/posts/preview/${slug}`;
        }
    }


    return (
        <>
            <Head>
                <title>Posts | ignews</title>
            </ Head>
            <main className={styles.container}>
                <div className={styles.posts}>

                    {posts.map(post => (
                        <Link key={post.slug} href={handleDirect(post.slug)}>
                            <a key={post.slug}>
                                <time>{post.updateAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </ Link>
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
        props: { posts },
        revalidate: 60 * 10
    }

}