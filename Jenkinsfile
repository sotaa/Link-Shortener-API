pipeline {
  agent {
    node {
      label 'build'
    }

  }
  stages {
    stage('Install Dependencies') {
      steps {
        sh '''rm package-lock.json
npm i'''
      }
    }
    stage('Build') {
      steps {
        sh 'tsc'
      }
    }
    stage('Launch') {
      steps {
        sh 'node dist/App.js'
      }
    }
  }
}