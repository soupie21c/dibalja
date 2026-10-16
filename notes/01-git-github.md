# 01. Git / GitHub 연결하기

## SSH 키란?

GitHub에 비밀번호 없이 안전하게 접속하기 위한 열쇠.
- `id_ed25519` : 개인키 (절대 공유 금지)
- `id_ed25519.pub` : 공개키 (GitHub에 등록)

## 한 일

```bash
ssh-keygen -t ed25519 -C "이메일"       # 키 만들기
pbcopy < ~/.ssh/id_ed25519.pub          # 공개키 복사 → GitHub Settings > SSH keys 에 등록
ssh -T git@github.com                   # 연결 확인 ("Hi 아이디!" 나오면 성공)
```

## 자주 쓰는 Git 명령어

```bash
git clone 주소      # GitHub 저장소를 내 컴퓨터로 받기
git status          # 지금 바뀐 파일 확인
git add .           # 바뀐 파일 전부 올릴 준비
git commit -m "메모" # 저장(기록) 남기기
git push            # GitHub에 올리기
git pull            # GitHub의 최신 내용 받아오기
```

## 배운 점

- 터미널에서 비밀번호 입력할 때는 화면에 아무것도 안 보이는 게 정상
- 명령어 복사할 때 `k3i@... %` 프롬프트 부분은 빼고 붙여넣기
- GitHub 저장소 이름은 한글 불가 → 영어로 짓기
