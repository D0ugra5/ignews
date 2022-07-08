
import styles from './home.module.scss'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton/indext'
import { Product, StripeApi } from '../services/stripe'
import Image from 'next/image'

export default function Home(props: Product) {
  return (
    <>
      <Head>
        <title>Home | Ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome </span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get access to all the publication <br />
            <span>for {props.amount} month</span>
          </p>
          <SubscribeButton priceId={props.priceId} />
        </section>
        <Image 
        height={840} 
        width={400} 
        src="/images/avatar.svg" 
        alt="girl coding" 
        />
      </main>
    </>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new StripeApi();
  const { amount, priceId } = await stripe.stripeFindPriceProduct();
  return {
    props: {
      amount,
      priceId
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }

}


