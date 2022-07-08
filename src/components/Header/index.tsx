
import { SignInButton } from './SignInButton';

import styles from './styles.module.scss';
import { ActiveLink } from './../ActiveLink/index';
import Image from 'next/image';
export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
            <Image width={110} height={31} src="/images/logo.svg" alt="Ig.news" />
                <nav>
                    <ActiveLink activeClassName={styles.active} href='/' >
                        <a>Home</a>
                    </ActiveLink>

                    <ActiveLink activeClassName={styles.active} href='/posts' >
                        <a >Posts</a>
                    </ActiveLink>
                </nav>
                <SignInButton />
            </div>
        </header>

    )
}