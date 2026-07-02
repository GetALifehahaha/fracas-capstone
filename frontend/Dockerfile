FROM node:20-alpine

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# `npm ci` above bakes a reproducible install into the image. At runtime a
# named volume shadows /frontend/node_modules, so run `npm install` first to
# reconcile that volume with the current lockfile (installs only the delta,
# no-op when already in sync) before starting the dev server.
CMD ["sh", "-c", "npm install && npm run dev -- --host"]