module.exports = {
  apps : [{
    name      : 'CVA',
    script    : './src/app.js',
    instances: '1',
    output: './logs/out.log',
    error: './logs/error.log',
    log: './logs/combined.outerr.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    env: {
      NODE_ENV: 'development',
      PM2_SERVE_PATH: '.',
      PM2_SERVE_PORT: 9002
    },
    env_production : {
      NODE_ENV: 'production',
      PM2_SERVE_PATH: '.',
      PM2_SERVE_PORT: 9002,
    },
    max_memory_restart: '2G'
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
