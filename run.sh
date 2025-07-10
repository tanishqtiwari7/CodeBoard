#!/bin/bash

# CodeBoard Development Script
# This script helps you manage the CodeBoard application easily

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
BACKEND_DIR="CodeBoard-backend"
FRONTEND_DIR="Codeboard-frontend"

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_color $BLUE "🔍 Checking prerequisites..."
    
    if ! command_exists java; then
        print_color $RED "❌ Java is not installed. Please install Java 21+"
        exit 1
    fi
    
    if ! command_exists node; then
        print_color $RED "❌ Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_color $RED "❌ npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Java version
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 21 ]; then
        print_color $YELLOW "⚠️  Java version is $JAVA_VERSION. Java 21+ is recommended"
    fi
    
    # Check Node version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_color $YELLOW "⚠️  Node.js version is $NODE_VERSION. Node.js 18+ is recommended"
    fi
    
    print_color $GREEN "✅ Prerequisites check completed"
}

# Function to setup the project
setup() {
    print_color $BLUE "🚀 Setting up CodeBoard..."
    
    check_prerequisites
    
    # Setup backend
    if [ -d "$BACKEND_DIR" ]; then
        print_color $BLUE "📦 Setting up backend..."
        cd "$BACKEND_DIR"
        ./gradlew build -x test
        cd ..
        print_color $GREEN "✅ Backend setup completed"
    else
        print_color $RED "❌ Backend directory not found: $BACKEND_DIR"
        exit 1
    fi
    
    # Setup frontend
    if [ -d "$FRONTEND_DIR" ]; then
        print_color $BLUE "📦 Setting up frontend..."
        cd "$FRONTEND_DIR"
        npm install
        cd ..
        print_color $GREEN "✅ Frontend setup completed"
    else
        print_color $RED "❌ Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    print_color $GREEN "🎉 Setup completed successfully!"
    print_color $BLUE "💡 You can now run: $0 start"
}

# Function to start the backend
start_backend() {
    print_color $BLUE "🚀 Starting backend server..."
    cd "$BACKEND_DIR"
    
    # Check if gradlew exists
    if [ ! -f "./gradlew" ]; then
        print_color $RED "❌ gradlew not found in $BACKEND_DIR"
        exit 1
    fi
    
    ./gradlew bootRun &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    print_color $YELLOW "⏳ Waiting for backend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
            print_color $GREEN "✅ Backend started successfully on http://localhost:8080"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            print_color $RED "❌ Backend failed to start within 60 seconds"
            kill $BACKEND_PID 2>/dev/null || true
            exit 1
        fi
    done
}

# Function to start the frontend
start_frontend() {
    print_color $BLUE "🚀 Starting frontend server..."
    cd "$FRONTEND_DIR"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_color $RED "❌ package.json not found in $FRONTEND_DIR"
        exit 1
    fi
    
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    print_color $YELLOW "⏳ Waiting for frontend to start..."
    sleep 5
    print_color $GREEN "✅ Frontend started successfully on http://localhost:5173"
}

# Function to start both services
start() {
    print_color $BLUE "🚀 Starting CodeBoard application..."
    
    check_prerequisites
    
    # Start backend
    start_backend
    
    # Start frontend
    start_frontend
    
    print_color $GREEN "🎉 CodeBoard is now running!"
    print_color $BLUE "📖 Backend API: http://localhost:8080"
    print_color $BLUE "🌐 Frontend App: http://localhost:5173"
    print_color $YELLOW "💡 Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Function to stop all services
stop() {
    print_color $YELLOW "🛑 Stopping CodeBoard services..."
    
    # Kill processes by port
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    
    print_color $GREEN "✅ All services stopped"
}

# Function to run tests
test() {
    print_color $BLUE "🧪 Running tests..."
    
    # Backend tests
    if [ -d "$BACKEND_DIR" ]; then
        print_color $BLUE "🧪 Running backend tests..."
        cd "$BACKEND_DIR"
        ./gradlew test
        cd ..
        print_color $GREEN "✅ Backend tests completed"
    fi
    
    # Frontend tests
    if [ -d "$FRONTEND_DIR" ]; then
        print_color $BLUE "🧪 Running frontend tests..."
        cd "$FRONTEND_DIR"
        npm run lint:check
        npm run type-check
        cd ..
        print_color $GREEN "✅ Frontend tests completed"
    fi
    
    print_color $GREEN "🎉 All tests completed successfully!"
}

# Function to build the project
build() {
    print_color $BLUE "🔨 Building CodeBoard..."
    
    # Build backend
    if [ -d "$BACKEND_DIR" ]; then
        print_color $BLUE "🔨 Building backend..."
        cd "$BACKEND_DIR"
        ./gradlew build
        cd ..
        print_color $GREEN "✅ Backend build completed"
    fi
    
    # Build frontend
    if [ -d "$FRONTEND_DIR" ]; then
        print_color $BLUE "🔨 Building frontend..."
        cd "$FRONTEND_DIR"
        npm run build:prod
        cd ..
        print_color $GREEN "✅ Frontend build completed"
    fi
    
    print_color $GREEN "🎉 Build completed successfully!"
}

# Function to clean the project
clean() {
    print_color $YELLOW "🧹 Cleaning CodeBoard..."
    
    # Clean backend
    if [ -d "$BACKEND_DIR" ]; then
        print_color $BLUE "🧹 Cleaning backend..."
        cd "$BACKEND_DIR"
        ./gradlew clean
        cd ..
    fi
    
    # Clean frontend
    if [ -d "$FRONTEND_DIR" ]; then
        print_color $BLUE "🧹 Cleaning frontend..."
        cd "$FRONTEND_DIR"
        rm -rf dist node_modules/.vite
        cd ..
    fi
    
    print_color $GREEN "✅ Cleanup completed"
}

# Function to show project status
status() {
    print_color $BLUE "📊 CodeBoard Status"
    echo "=========================="
    
    # Check if backend is running
    if curl -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
        print_color $GREEN "✅ Backend: Running (http://localhost:8080)"
    else
        print_color $RED "❌ Backend: Not running"
    fi
    
    # Check if frontend is running
    if curl -s http://localhost:5173 >/dev/null 2>&1; then
        print_color $GREEN "✅ Frontend: Running (http://localhost:5173)"
    else
        print_color $RED "❌ Frontend: Not running"
    fi
    
    # Show database status
    if [ -f "$BACKEND_DIR/codeboard.db" ]; then
        DB_SIZE=$(du -h "$BACKEND_DIR/codeboard.db" | cut -f1)
        print_color $BLUE "💾 Database: $DB_SIZE"
    else
        print_color $YELLOW "💾 Database: Not created yet"
    fi
}

# Function to show logs
logs() {
    SERVICE=${1:-"all"}
    
    case $SERVICE in
        "backend")
            print_color $BLUE "📄 Backend logs:"
            tail -f "$BACKEND_DIR/logs/spring.log" 2>/dev/null || echo "No backend logs found"
            ;;
        "frontend")
            print_color $BLUE "📄 Frontend logs:"
            echo "Frontend logs are shown in the console where you started the dev server"
            ;;
        *)
            print_color $BLUE "📄 Use: $0 logs [backend|frontend]"
            ;;
    esac
}

# Function to show help
help() {
    print_color $BLUE "📝 CodeBoard Development Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     🚀 Setup the project (install dependencies, build)"
    echo "  start     🏁 Start both backend and frontend servers"
    echo "  stop      🛑 Stop all running services"
    echo "  status    📊 Show status of all services"
    echo "  test      🧪 Run all tests"
    echo "  build     🔨 Build the entire project"
    echo "  clean     🧹 Clean build artifacts"
    echo "  logs      📄 Show logs [backend|frontend]"
    echo "  help      ❓ Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup          # First time setup"
    echo "  $0 start          # Start development servers"
    echo "  $0 status         # Check if services are running"
    echo "  $0 logs backend   # View backend logs"
    echo ""
    print_color $GREEN "Happy coding! 🚀"
}

# Main script logic
case "${1:-help}" in
    "setup")
        setup
        ;;
    "start")
        start
        ;;
    "stop")
        stop
        ;;
    "status")
        status
        ;;
    "test")
        test
        ;;
    "build")
        build
        ;;
    "clean")
        clean
        ;;
    "logs")
        logs "$2"
        ;;
    "help"|*)
        help
        ;;
esac
