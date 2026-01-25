FROM node:24-alpine as m4xdev
WORKDIR /app

RUN corepack enable

COPY . .
RUN ["pnpm", "install", "--frozen-lockfile", "--prod"]

USER node
EXPOSE 8080
CMD ["node", "--title=m4xdev", "--permission", "--allow-fs-read=.", "src/main.js"]
