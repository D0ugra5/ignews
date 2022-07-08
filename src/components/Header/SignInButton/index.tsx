import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"

export function SignInButton() {

    const { data: session } = useSession();

    return session ? (
        <button
            onClick={() => { signOut() }}
            type="button"
            className={styles.signInButton}
        >

            {session.user?.image ? <img src={session.user?.image} alt="Profile image" /> :
                <FaGithub color='#04d361' />
            }

            {session.user?.name}
            <FiX color='#08080a' className={styles.closeIcon} />
        </button>
    ) : (
        <button
            onClick={() => { signIn('github') }}
            type="button"
            className={styles.signInButton}
        >
            <FaGithub color='#eba417' />
            Sign In With GitHub
        </button>
    );

}