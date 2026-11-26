
# Build stage
FROM node:22-alpine AS builder

# Alpine mirror
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache tzdata

ENV TZ=Asia/Tehran

WORKDIR /app

# Node memory
ENV NODE_OPTIONS=--max-old-space-size=4096

ARG NEXT_PUBLIC_API_URL=https://api.ehsanimarket.ir
ARG NEXT_PUBLIC_SITE_URL=https://ehsanimarket.ir

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package*.json ./

# NPM mirror
RUN npm install

COPY . .

RUN npm run build


# Runtime stage
FROM node:22-alpine AS runner

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache tzdata

ENV TZ=Asia/Tehran
ENV NODE_ENV=production
ENV PORT=5281

ENV NEXT_PUBLIC_API_URL=https://api.ehsanimarket.ir
ENV NEXT_PUBLIC_SITE_URL=https://ehsanimarket.ir

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 5281

CMD ["npm", "start"]
