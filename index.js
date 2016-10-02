var ws = new WebSocket('wss://part-1-task-1.herokuapp.com');
//var ws = new WebSocket('ws://localhost:8080');

var sum = null;
var tasks = ["echo","reverse","sum","calc","median","groups","recurrence","validator","recurrence2"];
var numTask = 1;
var medianNums = null;
var objs = null;
var recList = null;


//===========================================

//var obj1 = {
//    "aaa": "zxc",
//    "qqq": "123",
//    "zzz": ["123", "321"]
//}

//var obj2 = {
//    "qqq": "123",
//    "aaa": "zxc",
//    "zzz": ["321", "123"]
//}

//===========================================


ws.onopen = function (e) {
    console.log('open', e);
    ws.send(JSON.stringify({
        type: 'hi',
        mode: 'complete',
        repo: 'https://github.com/Kozyyy/part-1-task-1/',
        name: 'Kozyyy'
    }));
    
    //console.log(deepEqual(obj1, obj2))
    
   // var array1 = [2, 4];
   // var array2 = [4, 2];
    
   // console.log(array1.compare(array2));
    ws.send(JSON.stringify({
        type: 'task',
        task: 'echo'
    }));
    
};

ws.onerror = function (e) {
    console.log('error', e);
};

ws.onclose = function (e) {
    console.log('close', e);
};

ws.onmessage = function (e) {
    var message = JSON.parse(e.data);
    console.log('message', message);
    
    if(message.type == "done") {
        numTask = numTask + 1;
        switch(numTask) {
            case 1:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'reverse'
                }));
                break;
            case 2:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'sum'
                }));
                break;
            case 3:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'calc'
                }));
                break;
                
            case 4:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'median'
                }));
                break;
                
            case 5:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'groups'
                }));
                break;
                
            case 6:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'recurrence'
                }));
                break;
            
            case 7:
                ws.send(JSON.stringify({
                    type: 'task',
                    task: 'validate'
                }));
                break;
            
                
        }
    }
    
    
    if(message.taskName == "echo") {
        ws.send(JSON.stringify({
            type: 'answer',
            data: message.data
        }));
    }
    
    if(message.taskName == "reverse") {
        ws.send(JSON.stringify({
            type: 'answer',
            data: reverse(message.data)
        }));
    }
    
    if(message.taskName == "sum") {
        if(sum == null) {
            sum = message.data
        }
        else {
            sum = sum + message.data   
        }
    }
    
    if(message.type == "askComplete") {
        if(numTask == 2){
            if(sum != null) {
                ws.send(JSON.stringify({
                    type: 'answer',
                    data: sum
                }));
            }
            sum = null;
        }
        if(numTask == 5) {
            ws.send(JSON.stringify({
                type: 'answer',
                data: groupBy()
            }));
        }
    }
    
    if(message.taskName == "calc") {
        ws.send(JSON.stringify({
            type: 'answer',
            data: eval(message.data)
        }));
    }   
    
    if(message.taskName =="median") {
        if(medianNums == null) {
            medianNums = [message.data]
        }
        else {
            medianNums.push(message.data)
        }
        ws.send(JSON.stringify({
            type: 'answer',
            data: median(medianNums)
        }));
        
    }
    
    
    if(message.taskName =="groups") {
        if(objs == null) {
            objs = [message.data]
        }
        else {
            objs.push(message.data)
        }
    }
    
    
    if(message.taskName =="recurrence") {
        if(recList == null) {
            recList = [message.data];
            ws.send(JSON.stringify({
                type: 'answer',
                data: false
            }));
        }
        else {
            var ii = 0;
            for(ii = 0; ii < recList.length; ii++) {
                if(deepEqual(message.data, recList[ii])) {
                    ws.send(JSON.stringify({
                        type: 'answer',
                        data: true
                    }));
                }
                else {
                    ws.send(JSON.stringify({
                        type: 'answer',
                        data: false
                    }));
                }
            }
            recList.push(message.data);
        }
    }
};

function send(message) {
    ws.send(JSON.stringify(message));
}

function reverse(s){
    return s.split("").reverse().join("");
}

function median(values) {
    newA = values.slice();
    newA.sort((a, b) => a - b);
    while(newA.length > 1) {
        newA.reverse().pop()
    }
    return newA[0];
}
    
function groupBy() {
    var newArr = [];
    var i = 0;
    for(i = 0; i < objs.length; i++) {
        if(newArr[objs[i].group] == null) {
            var group = [];
            group.push(objs[i].value);
            newArr[objs[i].group] = group;
        }
        else {
            newArr[objs[i].group].push(objs[i].value);
        }
    }
    return newArr;
}

//function compare(a, b) {
//    var aProps = 
//}

function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    
    if(Array.isArray(a) && Array.isArray(b)) {
        if(a.compare(b)) {
            return true;
        }
    }
 
    if (a == null || typeof(a) != "object" ||
        b == null || typeof(b) != "object")
    {
        return false;
    }
 
    var propertiesInA = 0, propertiesInB = 0;
    for (var property in a) {
        propertiesInA += 1;
    }
    for (var property in b) {
        propertiesInB += 1;
        if (!(property in a) || !deepEqual(a[property], b[property])) {
            return false;        
        }
    }        
    return propertiesInA == propertiesInB;
}
    
Array.prototype.compare = function(testArr) {
    //console.log(this, testArr);
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { //To test values in nested arrays
            if (!this[i].compare(testArr[i])) return false;
        }
        else if (this[i] !== testArr[i]) return false;
    }
    return true;
}
