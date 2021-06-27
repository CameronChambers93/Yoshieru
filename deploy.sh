cd /home/ec2-user/Yoshieru/
npm run build
cp dist/ -r /home/ec2-user/Yoshieru-backend/server/
pm2 restart 0
