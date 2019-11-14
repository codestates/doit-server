# Doit-server

- 본 파일은 Doit 프로그램의 API 서버 파일입니다.
- Doit 프로그램을 사용하기 위해서는 본 파일과 상관없이 Doit 클라이언트의 주소 (https://youdoit.space)에 접속하여 사용할 수 있으며, 개인적으로 local에서 실행시키고자 한다면 본 파일과 함께 Doit 클라이언트 파일을 함께 다운 받으시기 바라며 mysql이 깔려 있어야 합니다.

# local에서 프로그램을 실행시키는 법

1. git clone https://github.com/codestates/doit-server.git 를 하여 파일을 받습니다.
2. 본 파일의 최상위 디렉토리에 .env 파일을 만들고 해당 내용을 입력합니다.
   아래의 YOUR_SECRETNAME, YOUR_PASSWORD를 채워주시면 됩니다.

   COOKIE_SECRET=YOUR_SECRETNAME

   DEVLOCAL_USERNAME=root
   DEVLOCAL_PASSWORD=YOUR_PASSWORD
   DEVLOCAL_DATABASE=doit
   DEVLOCAL_HOST=127.0.0.1
   DEVLOCAL_DIALECT=mysql

3. npm i 를 하여 package.json의 module들을 install 합니다.
4. npx sequelize db:create를 터미널에 입력하여 mysql에 db schema를 생성합니다. //mysql 서버 키는 과정??
5. (option) 본 파일에는 기본 test data가 있습니다. 이 data들을 입력하고 싶다면 npx sequelize db:seed:all 을 입력합니다.
6. 실행은 npm run dev를 하면 됩니다.
7. 기존 table의 data를 지우고 싶다면 node utils/resetTables.js 를 입력하면 됩니다.

# 간단 폴더 설명

1. config = 어느 database에 연결할지 설정이 담겨 있습니다.
2. controllers = request가 들어올시 실제 실행되는 함수가 담겨있습니다.
3. models = database의 각 table에 대한 정의가 들어 있습니다.
4. passport = 로그인시 이용할 passport js의 logic이 담겨있습니다.
5. routes = API 요청시 어떤 함수를 실행할지 route가 있습니다.
6. seeders = test data가 있습니다.
7. utils = table을 reset하는 것과 입력 data를 validation하는 파일이 있습니다.
8. index.js = 기본 express 설정 및 middleware 실행이 들어있습니다.
