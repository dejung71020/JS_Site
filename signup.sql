CREATE database JS_SITE;

USE JS_SITE;

CREATE TABLE user (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL, 
    name VARCHAR(50) NOT NULL,
    birth_year INT NOT NULL,
    birth_month TINYINT NOT NULL,
    birth_day TINYINT NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE, 
    gender ENUM('male', 'female', 'other') NOT NULL
);

CREATE TABLE post (
    idx INT  AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    text VARCHAR(2000) NOT NULL,
    useridx INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    isDeleted TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_post_user
    FOREIGN KEY (useridx) REFERENCES user (idx)
    ON DELETE CASCADE 
);
DROP TABLE user;
DROP TABLE post;
SELECT * FROM user;
SELECT * FROM post;

INSERT INTO post (title, text, useridx, createdAt, updatedAt) VALUES
(
    '첫 번째 Doogle 방문 후기', 
    '새로운 디자인이 적용된 페이지가 정말 깔끔하고 좋습니다. 사용자 경험이 훨씬 향상된 것 같아요!', 
    1, -- user 테이블의 1번 사용자
    NOW(), 
    NOW()
),
(
    '게시판 기능 테스트', 
    '게시글 작성, 수정, 삭제 기능이 제대로 작동하는지 확인하는 테스트용 글입니다. 백엔드 연결 상태 양호합니다.', 
    2, -- user 테이블의 2번 사용자
    NOW(), 
    NOW()
),
(
    '오늘의 JS 공부: 비동기 처리', 
    'Promise와 async/await을 사용한 비동기 패턴에 대해 정리했습니다. 콜백 지옥에서 벗어나는 방법은 정말 중요합니다.', 
    1, 
    NOW(), 
    NOW()
),
(
    '제목이 길어지면 어떻게 표시될까?', 
    '제목이 50자를 초과하지 않는지 확인하는 중입니다. 이 정도 길이에서는 목록에서 깔끔하게 보일 것 같습니다. 실제 내용은 짧아도 괜찮아요.', 
    2, 
    NOW(), 
    NOW()
),
(
    '새로운 기능 제안합니다!', 
    '게시글에 댓글 기능을 추가하면 커뮤니티 활성화에 더 도움이 될 것 같습니다. 백엔드와 프론트엔드 모두 손봐야 할 부분이 많겠네요.', 
    1, 
    NOW(), 
    NOW()
);

SELECT p.idx, p.title, p.text, p.createdAt, p.updatedAt, p.useridx, u.userid, u.name 
    FROM post p 
    JOIN user u ON p.useridx = u.idx 
    WHERE p.idx=1;
    