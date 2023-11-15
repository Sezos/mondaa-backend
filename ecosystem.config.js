module.exports = {
  apps: [
    {
      name: 'zutguur-repair-backend',
      script: './dist/main.js',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      kill_timeout: 10000,
      max_memory_restart: '1G',
    },
  ],
};
