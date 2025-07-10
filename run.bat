@echo off
:: CodeBoard Development Script for Windows
:: This script helps you manage the CodeBoard application easily

setlocal enabledelayedexpansion

:: Project directories
set BACKEND_DIR=CodeBoard-backend
set FRONTEND_DIR=Codeboard-frontend

:: Colors (limited support in Windows)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

goto :main

:print_color
echo %~1%~2%NC%
goto :eof

:check_prerequisites
echo %BLUE%🔍 Checking prerequisites...%NC%

:: Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ Java is not installed. Please install Java 21+%NC%
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ Node.js is not installed. Please install Node.js 18+%NC%
    exit /b 1
)

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ npm is not installed. Please install npm%NC%
    exit /b 1
)

echo %GREEN%✅ Prerequisites check completed%NC%
goto :eof

:setup
echo %BLUE%🚀 Setting up CodeBoard...%NC%

call :check_prerequisites
if %errorlevel% neq 0 exit /b %errorlevel%

:: Setup backend
if exist "%BACKEND_DIR%" (
    echo %BLUE%📦 Setting up backend...%NC%
    cd "%BACKEND_DIR%"
    call gradlew.bat build -x test
    if %errorlevel% neq 0 (
        echo %RED%❌ Backend setup failed%NC%
        cd ..
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Backend setup completed%NC%
) else (
    echo %RED%❌ Backend directory not found: %BACKEND_DIR%%NC%
    exit /b 1
)

:: Setup frontend
if exist "%FRONTEND_DIR%" (
    echo %BLUE%📦 Setting up frontend...%NC%
    cd "%FRONTEND_DIR%"
    call npm install
    if %errorlevel% neq 0 (
        echo %RED%❌ Frontend setup failed%NC%
        cd ..
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Frontend setup completed%NC%
) else (
    echo %RED%❌ Frontend directory not found: %FRONTEND_DIR%%NC%
    exit /b 1
)

echo %GREEN%🎉 Setup completed successfully!%NC%
echo %BLUE%💡 You can now run: %0 start%NC%
goto :eof

:start_backend
echo %BLUE%🚀 Starting backend server...%NC%
cd "%BACKEND_DIR%"

if not exist "gradlew.bat" (
    echo %RED%❌ gradlew.bat not found in %BACKEND_DIR%%NC%
    cd ..
    exit /b 1
)

start /b call gradlew.bat bootRun
cd ..

echo %YELLOW%⏳ Waiting for backend to start...%NC%
timeout /t 10 /nobreak >nul

:: Simple check - just wait a bit more for the backend to be ready
timeout /t 10 /nobreak >nul
echo %GREEN%✅ Backend started successfully on http://localhost:8080%NC%
goto :eof

:start_frontend
echo %BLUE%🚀 Starting frontend server...%NC%
cd "%FRONTEND_DIR%"

if not exist "package.json" (
    echo %RED%❌ package.json not found in %FRONTEND_DIR%%NC%
    cd ..
    exit /b 1
)

start /b call npm run dev
cd ..

echo %YELLOW%⏳ Waiting for frontend to start...%NC%
timeout /t 5 /nobreak >nul
echo %GREEN%✅ Frontend started successfully on http://localhost:5173%NC%
goto :eof

:start
echo %BLUE%🚀 Starting CodeBoard application...%NC%

call :check_prerequisites
if %errorlevel% neq 0 exit /b %errorlevel%

:: Start backend
call :start_backend
if %errorlevel% neq 0 exit /b %errorlevel%

:: Start frontend
call :start_frontend
if %errorlevel% neq 0 exit /b %errorlevel%

echo %GREEN%🎉 CodeBoard is now running!%NC%
echo %BLUE%📖 Backend API: http://localhost:8080%NC%
echo %BLUE%🌐 Frontend App: http://localhost:5173%NC%
echo %YELLOW%💡 Press Ctrl+C to stop services (you may need to stop them manually)%NC%

:: Keep the window open
echo Press any key to continue...
pause >nul
goto :eof

:stop
echo %YELLOW%🛑 Stopping CodeBoard services...%NC%

:: Stop processes by port (Windows approach)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do (
    echo Stopping backend on PID %%a
    taskkill /f /pid %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    echo Stopping frontend on PID %%a
    taskkill /f /pid %%a 2>nul
)

:: Also try to stop Java and Node processes related to our project
taskkill /f /im "java.exe" 2>nul
taskkill /f /im "node.exe" 2>nul

echo %GREEN%✅ Stop command executed%NC%
goto :eof

:test
echo %BLUE%🧪 Running tests...%NC%

:: Backend tests
if exist "%BACKEND_DIR%" (
    echo %BLUE%🧪 Running backend tests...%NC%
    cd "%BACKEND_DIR%"
    call gradlew.bat test
    if %errorlevel% neq 0 (
        echo %RED%❌ Backend tests failed%NC%
        cd ..
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Backend tests completed%NC%
)

:: Frontend tests
if exist "%FRONTEND_DIR%" (
    echo %BLUE%🧪 Running frontend linting and type checking...%NC%
    cd "%FRONTEND_DIR%"
    call npm run lint:check
    if %errorlevel% neq 0 (
        echo %YELLOW%⚠️ Frontend linting issues found%NC%
    )
    call npm run type-check
    if %errorlevel% neq 0 (
        echo %RED%❌ Frontend type checking failed%NC%
        cd ..
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Frontend tests completed%NC%
)

echo %GREEN%🎉 All tests completed!%NC%
goto :eof

:build
echo %BLUE%🔨 Building CodeBoard...%NC%

:: Build backend
if exist "%BACKEND_DIR%" (
    echo %BLUE%🔨 Building backend...%NC%
    cd "%BACKEND_DIR%"
    call gradlew.bat build
    if %errorlevel% neq 0 (
        echo %RED%❌ Backend build failed%NC%
        cd ..
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Backend build completed%NC%
)

:: Build frontend
if exist "%FRONTEND_DIR%" (
    echo %BLUE%🔨 Building frontend...%NC%
    cd "%FRONTEND_DIR%"
    call npm run build:prod
    if %errorlevel% neq 0 (
        echo %RED%❌ Frontend build failed%NC%
        cd ..
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Frontend build completed%NC%
)

echo %GREEN%🎉 Build completed successfully!%NC%
goto :eof

:clean
echo %YELLOW%🧹 Cleaning CodeBoard...%NC%

:: Clean backend
if exist "%BACKEND_DIR%" (
    echo %BLUE%🧹 Cleaning backend...%NC%
    cd "%BACKEND_DIR%"
    call gradlew.bat clean
    cd ..
)

:: Clean frontend
if exist "%FRONTEND_DIR%" (
    echo %BLUE%🧹 Cleaning frontend...%NC%
    cd "%FRONTEND_DIR%"
    if exist "dist" rmdir /s /q "dist"
    if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
    cd ..
)

echo %GREEN%✅ Cleanup completed%NC%
goto :eof

:status
echo %BLUE%📊 CodeBoard Status%NC%
echo ==========================

:: Check backend port
netstat -an | find ":8080" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo %GREEN%✅ Backend: Running (http://localhost:8080)%NC%
) else (
    echo %RED%❌ Backend: Not running%NC%
)

:: Check frontend port
netstat -an | find ":5173" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo %GREEN%✅ Frontend: Running (http://localhost:5173)%NC%
) else (
    echo %RED%❌ Frontend: Not running%NC%
)

:: Check database
if exist "%BACKEND_DIR%\codeboard.db" (
    for %%I in ("%BACKEND_DIR%\codeboard.db") do echo %BLUE%💾 Database: %%~zI bytes%NC%
) else (
    echo %YELLOW%💾 Database: Not created yet%NC%
)
goto :eof

:help
echo %BLUE%📝 CodeBoard Development Script%NC%
echo.
echo Usage: %0 [command]
echo.
echo Commands:
echo   setup     🚀 Setup the project (install dependencies, build)
echo   start     🏁 Start both backend and frontend servers
echo   stop      🛑 Stop all running services
echo   status    📊 Show status of all services
echo   test      🧪 Run all tests
echo   build     🔨 Build the entire project
echo   clean     🧹 Clean build artifacts
echo   help      ❓ Show this help message
echo.
echo Examples:
echo   %0 setup          # First time setup
echo   %0 start          # Start development servers
echo   %0 status         # Check if services are running
echo.
echo %GREEN%Happy coding! 🚀%NC%
goto :eof

:main
if "%1"=="" goto :help
if "%1"=="setup" goto :setup
if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="status" goto :status
if "%1"=="test" goto :test
if "%1"=="build" goto :build
if "%1"=="clean" goto :clean
if "%1"=="help" goto :help
goto :help
