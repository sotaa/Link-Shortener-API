pipeline {
  agent {
    node {
      label 'build'
    }

  }
  stages {
    stage('Install Dependencies') {
      steps {
        bat 'rm package-lock.json'
        bat 'npm i'
      }
    }
    stage('Build') {
      steps {
        bat 'tsc'
      }
    }
    stage('Launch') {
      steps {
        bat 'node dist/App.js'
      }
    }
  }
}
