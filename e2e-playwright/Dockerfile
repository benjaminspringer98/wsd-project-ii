FROM mcr.microsoft.com/playwright:v1.38.0-vrt-arm64

COPY . /e2e-playwright

WORKDIR /e2e-playwright

RUN npm install

CMD [ "npx", "playwright", "test", "--reporter=list" ]