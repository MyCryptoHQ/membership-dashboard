module.exports = {
    siteMetadata: {
        title: 'Membership Dashboard',
        siteUrl: 'https://memberships.mycryptoapi.com',
        description: 'MyCrypto Membership Dashboard'
    },
    pathPrefix: '/',
    plugins: [
        'gatsby-plugin-typescript',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sitemap',
        'gatsby-plugin-styled-components',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: 'src/images'
            }
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: 'gatsby-plugin-less',
            options: {
                javascriptEnabled: true,
                modifyVars: {
                    'primary-color': '#007896'
                }
            }
        },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Membership Dashboard',
                short_name: 'Dashboard',
                start_url: '/',
                background_color: '#ffffff',
                theme_color: '#007896',
                display: 'minimal-ui',
                icon: 'src/images/favicon.png'
            }
        },
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                cssLoaderOptions: {
                    camelCase: false
                }
            }
        },
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                policy: [
                    {
                        userAgent: '*',
                        disallow: '/'
                    }
                ]
            }
        },
        {
            resolve: 'gatsby-plugin-antd',
            options: {
                style: true
            }
        },
        'gatsby-plugin-remove-trailing-slashes'
    ]
};
