FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 빌드된 파일을 최종 이미지로 복사
FROM nginx:alpine

# Nginx 기본 설정 파일을 삭제하고, 빌드된 파일을 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx의 설정파일을 변경합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 80을 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]