module.exports = {
  apps: [{
    name: 'monitoring',
    script: './bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    //args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    watch_delay: 3000,
    ignore_watch : ["node_modules","public"],
    max_memory_restart: '1G',
    env: {
      "PORT": 3013,
      "NODE_ENV": 'development'
    },
    env_production: {
      "PORT": 3013,
      "NODE_ENV": 'production'
    },
    env_testing: {
      "PORT": 3013,
      "NODE_ENV": 'testing'
    }
  }]
};
