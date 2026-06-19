import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import { ekzDocPackages } from '../../packages';
import styles from './index.module.css';

export default function Home(): React.JSX.Element {
    return (
        <Layout title="@ekz documentation" description="Documentation for @ekz npm packages">
            <main className="container margin-vert--lg">
                <div className={styles.hero}>
                    <h1 className={styles.heroTitle}>@ekz documentation</h1>
                    <p className={styles.heroSubtitle}>
                        Guides for the public @ekz libraries — forms, async state, HTTP clients, and
                        more.
                    </p>
                </div>
                <div className={styles.grid}>
                    {ekzDocPackages.map((pkg) => (
                        <Link key={pkg.id} className={styles.card} to={`/${pkg.routeBasePath}/`}>
                            <span
                                className={styles.accent}
                                style={{ backgroundColor: pkg.accent }}
                            />
                            <span className={styles.pkg}>{pkg.npm}</span>
                            <span className={styles.desc}>{pkg.description}</span>
                        </Link>
                    ))}
                </div>
            </main>
        </Layout>
    );
}
