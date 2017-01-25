# Spark release / deployment guidelines

## GitHub releases

* https://github.com/Midburn/Spark/releases
* There should always be 1 draft release against master branch
* This draft release is updated on each merge or commit to master.

### Publishing a release

* When release is ready (e.g. have enough content / is stable enough)- you can publish it
* **Before publishing on GitHub** - you should update the [package.json](/package.json) "version" attribute to match the GitHub release you are about to publish
* merge the change in package.json to master
* don't forget to push!
* now, you can publish the release in GitHub

## Manual Deployment

### Create the deployment package

* ```npm run build --file=<OUTPUT_FILE_NAME>```
  * We just tar.gz the source directory while excluding some files.
  * might add some more stuff in the future - basically we want as much work done here as possible so deployment is quick

### Upload the deployment package to slack

We use slack as an easy to use repository of deployment packages.

* ```npm run upload --file=<PACKAGE_FILE_NAME> --token=<SLACK_API_TOKEN>```
  * creates a file called <PACKAGE_FILE_NAME>.slack_url containing the private package url

### Download a package from the private package url

* ```npm run download --file=<OUTPUT_FILE_NAME> --url=<PACKAGE_PRIVATE_URL> --token=<SLACK_API_TOKEN>```
  * downloads from the given private slack url to the given output file name

### Deploy the package

To deploy a package file:

* extract the package (tar.gz)
* create a .env file in the package directory with relevant configurations
* run the deploy command from the root of the extracted deployment pacakge
  * ```npm run deploy```

## Testing the deployment procedures using vagrant

There is a vagrant machine which allows to test the deployment flow locally.

It runs the flow of building a package, then extracting and deploying it locally inside the vagrant instance.

You can also download a package from slack (using ```npm run download```) and then deploy it.

To use it, [install vagrant](https://www.vagrantup.com/docs/installation/), then run the following from spark/vagrant directory:

```
spark$ cd vagrant
spark/vagrant$ vagrant up
```

Now, you can ssh into the instance, the deployed package is at /opt/spark/deployment

When you run node / npm - you will have correct version for the deployment.

For example, to start the spark web-app:

```
spark/vagrant$ vagrant ssh
ubuntu@ubuntu-xenial:~$ cd /opt/spark/deployment
ubuntu@ubuntu-xenial:/opt/spark/deployment$ node server.js
```

## Automated deployment using Travis-CI

Travis is run on every pull requests / commit to branch.

Have a look at the [.travis.yml](/.travis.yml) and [/.travis/on_build_complete.sh](/.travis/on_build_complete.sh) to see what it does.

### Travis build flow

* runs the tests
* on failure - just notify to slack (using ```npm run log```)
* if tests are successfull and it's not a pull request:
  * builds the package (using ```npm run build```)
  * uploads the package to slack (using ```npm run upload```)
  * sends notification to slack containing the built package url (using ```npm run log```)

### Testing travis build locally

You should set the following environment variables (modify accordingly..)

```
SLACK_API_TOKEN=""
SLACK_LOG_WEBHOOK=""
TRAVIS_PULL_REQUEST="false"
TRAVIS_REPO_SLUG="Midburn/Spark"
TRAVIS_BRANCH="master"
TRAVIS_BUILD_NUMBER="5"
TRAVIS_BUILD_ID="198736627323"
```

Now, you can run the commands from .travis.yml file


## Manual deployment environment

This procedure can be used to manually setup and deploy to a linux server.

### Setting up the environment

* tested on Ubuntu 16.04.1 LTS (Xenial) - but should work on any Linux variant with minor changes.

```
sudo apt-get install -y jq nginx
sudo mkdir -p /opt/spark/.nvm
sudo chown -R $USER /opt/spark
curl -o- "https://raw.githubusercontent.com/creationix/nvm/v0.33.0/nvm.sh" > /opt/spark/.nvm/nvm.sh
export NVM_DIR="/opt/spark/.nvm"
source "${NVM_DIR}/nvm.sh"
echo "export NVM_DIR=/opt/spark/.nvm" >> /home/ubuntu/.bashrc
echo "source /opt/spark/.nvm/nvm.sh" >> /home/ubuntu/.bashrc
```

Create an init.d service for the spark web-app

**Note** the service will be able to start only after you do a deployment

```
echo "#!/usr/bin/env bash" > /opt/spark/start.sh
echo "export NVM_DIR=/opt/spark/.nvm" >> /opt/spark/start.sh
echo "source /opt/spark/.nvm/nvm.sh" >> /opt/spark/start.sh
echo "cd /opt/spark/latest && npm start" >> /opt/spark/start.sh
chmod +x /opt/spark/start.sh
curl -o- https://raw.githubusercontent.com/fhd/init-script-template/master/template | sudo tee /etc/init.d/midburn-spark
sudo chmod +x /etc/init.d/midburn-spark
sudo nano /etc/init.d/midburn-spark
```

In /etc/init.d/spark file, set the following:

```
dir="/opt/spark/latest"
cmd="/opt/spark/start.sh"
user="ubuntu"
```

Setup nginx as a proxy to the local web-app on port 3000

```
sudo nano /etc/nginx/sites-available/midburn-spark
```

Paste the configuration, something like this:

```
server {
    listen       80;
    server_name  54.194.247.12;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

Restart nginx

```
sudo service nginx restart
```

### Configuring the environment

Replace "..." with the actual values

```
echo 'SLACK_API_TOKEN="..."' >> /opt/spark/.env
echo 'SLACK_LOG_WEBHOOK="..."' >> /opt/spark/.env
```

Create an opsworks.js file too (it will be copied to the deployment directory)

Fill it with relevant configurations

```
nano /opt/spark/opsworks.js
```

Currently we use sqlite3 database, so you should create a file that will contain it

```
touch /opt/spark/dev.sqlite3
```

### Downloading a deployment package

Replace "..." with a private slack package url (which you probably got from slack notification about build success)

```
DEPLOYMENT_PACKAGE_URL="..."
. /opt/spark/.env
curl -H "Authorization: Bearer ${SLACK_API_TOKEN}" -g "${DEPLOYMENT_PACKAGE_URL}" -o- > /opt/spark/package.tar.gz
```

### deploying the downloaded package

```
rm -rf /opt/spark/new && mkdir -p /opt/spark/new && cd /opt/spark/new
tar xzf /opt/spark/package.tar.gz
ln -s /opt/spark/.env .env && ln -s /opt/spark/opsworks.js opsworks.js && ln -s /opt/spark/dev.sqlite3 dev.sqlite3
nvm install && nvm use
npm run deploy
node_modules/.bin/knex migrate:latest
[ -d /opt/spark/old ] && rm -rf /opt/spark/old
[ -d /opt/spark/latest ] && mv /opt/spark/latest /opt/spark/old
mv /opt/spark/new /opt/spark/latest
sudo /etc/init.d/midburn-spark restart
```

### Checking server logs / debugging problems

```
sudo /etc/init.d/midburn-spark status
sudo tail /var/log/midburn-spark.*
```
