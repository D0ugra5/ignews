
import styles from './styles.module.scss'
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripejs } from '../../services/stripe.js';
import { useRouter } from 'next/router';

interface SubscribeButtonProps {
    priceId: string;
}


export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { status } = useSession();
    const { data } = useSession();
    const router = useRouter();

    async function handleSubscribe() {
        if (status != "authenticated") {
            signIn('github');
            return;
        }

        if (data?.userActiveSubscription) {
            router.push('/posts');
            return
        }

        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;

            const stripe = await getStripejs();

            await stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            alert(error);
        }

    }
    return (
        <button
            onClick={handleSubscribe}
            type="button"
            className={styles.subscribeButton}
        >
            Subscribe Now!
        </button>
    )
}