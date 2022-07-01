pipeline {
  agent any
  
  options { 
        disableConcurrentBuilds() 
        buildDiscarder(logRotator(numToKeepStr: "5", daysToKeepStr: "5"))
        timeout(time: 1, unit: 'HOURS')
    }
        
    stages {    
        stage('build ms-moservice-operator-web') {
            steps {
                build job: 'ms-moservice-operator-web', wait: false
            }
        }
        
    }
}
