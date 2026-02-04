    FROM node AS build

    WORKDIR /frontend

    COPY package.json package-lock.json ./

    RUN npm install

    COPY . .

    ARG REACT_APP_API_URL
    ENV REACT_APP_API_URL=$REACT_APP_API_URL

    RUN npm run build

    # ---- runtime stage ----
    FROM nginx

    COPY nginx.conf /etc/nginx/conf.d/default.conf

    COPY --from=build /frontend/build /usr/share/nginx/html

    EXPOSE 80

    CMD [ "nginx","-g", "daemon off;" ]



