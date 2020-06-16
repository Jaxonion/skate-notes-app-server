module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://axlgkcmxuctvbl:32a4a53a06d9802ce2b1faa6c617196b1e115541e575fca3d8ed776a85f32915@ec2-52-87-135-240.compute-1.amazonaws.com:5432/d1gc67ogrgv7d4',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '30m',
}