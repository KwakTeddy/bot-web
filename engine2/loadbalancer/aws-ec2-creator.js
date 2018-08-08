var path = require('path');
var AWS = require('aws-sdk');
AWS.config.loadFromPath(path.resolve('./aws-credentials.json'));

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var userData = '#!/bin/bash\r\n';
userData += 'cd /home/bot/bot-web\r\n';
userData += 'sudo service bot-web start';

var params = {
    ImageId: 'ami-c4bf1faa', // PlayChat LB Slave
    InstanceType: 't2.medium',
    MinCount: 1,
    MaxCount: 1,
    UserData: new Buffer(userData).toString('base64'),
    KeyName: 'moneybrain-aws',
    SecurityGroupIds: ['sg-23a6fb4a']
};

module.exports.createInstance = function(callback)
{
    ec2.runInstances(params, function(err, data)
    {
        if (err)
        {
            console.log("Could not create instance", err);
            callback(err);
            return;
        }

        var targetInstance = data.Instances[0];
        console.log('타겟 인스턴스 : ', targetInstance);

        var instanceId = data.Instances[0].InstanceId;
        var privateHost = data.Instances[0].PrivateIpAddress;
        console.log("Created instance" + instanceId);
        // Add tags to the instance

        params = {Resources: [instanceId], Tags: [
            {
                Key: 'Name',
                Value: '신한카드 슬레이브 테스트 Auto'
            }
        ]};

        ec2.createTags(params, function(err)
        {
            console.log("Tagging instance", err ? "failure" : "success");
        });

        callback(null, { instanceId: instanceId, privateHost: privateHost });
    });
};

module.exports.deleteInstance = function(instanceId, callback)
{
    var params = {
        InstanceIds: [instanceId],
        DryRun: false
    };

    ec2.terminateInstances(params, function(err, data)
    {

        callback(err, data);
    });
};
