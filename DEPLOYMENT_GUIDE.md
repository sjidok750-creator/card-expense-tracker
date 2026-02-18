# Netlify 배포 가이드

## 1단계: GitHub 저장소 생성

1. GitHub (https://github.com) 에 로그인
2. 우측 상단 '+' 버튼 클릭 → "New repository" 선택
3. Repository name: `card-expense-tracker` 입력
4. Public 선택 (무료)
5. "Create repository" 클릭

## 2단계: 코드를 GitHub에 푸시

터미널에서 다음 명령어 실행 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경):

```bash
cd ~/card-expense-tracker
git remote add origin https://github.com/YOUR_USERNAME/card-expense-tracker.git
git branch -M main
git push -u origin main
```

## 3단계: Netlify에 배포

1. Netlify (https://app.netlify.com) 접속 및 로그인 (GitHub 계정으로 로그인 권장)
2. "Add new site" → "Import an existing project" 클릭
3. "Deploy with GitHub" 선택
4. `card-expense-tracker` 저장소 선택
5. 빌드 설정 확인:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (netlify.toml 파일이 이미 있어서 자동 설정됨)
6. "Deploy site" 클릭

## 4단계: 아이폰에서 접속

1. 배포 완료 후 제공되는 URL (예: `https://your-app-name.netlify.app`) 복사
2. 아이폰 Safari에서 해당 URL 접속
3. 공유 버튼 → "홈 화면에 추가" 선택
4. PWA 앱으로 설치 완료!

## 업데이트 방법

코드 수정 후:
```bash
git add .
git commit -m "업데이트 내용"
git push
```

Netlify가 자동으로 새 버전을 배포합니다.
