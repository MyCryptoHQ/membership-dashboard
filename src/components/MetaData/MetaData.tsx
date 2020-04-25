import React, { FunctionComponent } from 'react';
import Helmet from 'react-helmet';
import { graphql, StaticQuery } from 'gatsby';

const MetaData: FunctionComponent = () => (
    <StaticQuery
        query={graphql`
            query PageData {
                site {
                    siteMetadata {
                        title
                        siteUrl
                        description
                    }
                }
            }
        `}
        render={({ site: { siteMetadata } }) => {
            return (
                <Helmet htmlAttributes={{ lang: 'en' }}>
                    <title>{siteMetadata.title}</title>
                    <meta name="apple-mobile-web-app-title" content={siteMetadata.title} />
                    <meta name="description" content={siteMetadata.description} />
                    <meta name="theme-color" content="#007896" />
                    <meta name="mobile-web-app-capable" content="yes" />
                </Helmet>
            );
        }}
    />
);

export default MetaData;
