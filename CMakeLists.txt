cmake_minimum_required(VERSION 3.16)
project(MyRodCutting LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Tìm raylib đã cài qua Homebrew
find_package(raylib 5.5 REQUIRED)

file(GLOB SRCS src/*.cpp)
add_executable(dnc ${SRCS})

# Link raylib
target_link_libraries(dnc PRIVATE raylib)

# Nếu trên macOS, cần link thêm các framework
if(APPLE)
    find_library(COCOA Cocoa)
    find_library(IOKIT IOKit)
    find_library(OPENGL OpenGL)
    target_link_libraries(dnc PRIVATE ${COCOA} ${IOKIT} ${OPENGL})
endif()
