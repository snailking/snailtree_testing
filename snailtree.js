contractAddress="0x95e4D9C023adf01e8e8e83669F0c8B948B985B14"

/* WEB3 DETECTION */
// TESTNET!!
var web3;

window.addEventListener("load", function() {
	if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
        web3.version.getNetwork(function(error, result) {
            if (!error) {
                if (result == "3") {
					console.log("Mainnet successfully loaded!");
                } else {
                    console.log("You must be on the Testnet to play SnailFarm 3!");
					web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/f423492af8504d94979d522c3fbf3794"));
					//modal2.style.display = "block";
                }
            }
        });
    } else {
        console.log("Web3 library not found.");
		//modal2.style.display = "block";
        web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/f423492af8504d94979d522c3fbf3794"));
    }
});

/* VARIABLES */

var a_contractBalance;
var a_gameRound;
var a_roundPot;
var a_treePot;
var a_wonkPot;
var a_thronePot;
var a_jackPot;
var a_pecanToWin;
var a_pecanGiven;
var a_pecanLeft;
var a_lastRootPlant;
var a_playerBalance;
var a_playerRound;
var a_playerTree;
var a_playerPecan;
var a_playerLastClaim;
var a_playerEtherShare;
var a_playerPecanShare;
var a_rootPecanForOneEther;

var f_pecan;
var f_root;

var m_account = "waiting for web3";

var doc_contractBalance = document.getElementById('contractbalance');
var doc_gameRound = document.getElementById('gameround');
var doc_roundPot = document.getElementById('roundpot');
var doc_treePot = document.getElementById('treepot');
var doc_wonkPot = document.getElementById('wonkpot');
var doc_thronePot = document.getElementById('thronepot');
var doc_jackPot = document.getElementById('jackpot');
var doc_pecanToWin = document.getElementById('pecantowin');
var doc_pecanGiven = document.getElementById('pecangiven');
var doc_lastRootPlant = document.getElementById('lastrootplant');
var doc_playerBalance = document.getElementById('playerbalance');
var doc_playerRound = document.getElementById('playerround');
var doc_playerTree = document.getElementById('playertree');
var doc_playerPecan = document.getElementById('playerpecan');
var	doc_playerEtherShare = document.getElementById('playerethershare');
var	doc_playerPecanShare = document.getElementById('playerpecanshare');
var	doc_rootPecanForOneEther = document.getElementById('rootpecanforoneether');
//var doc_playerLastClaim = document.getElementById('playerlastclaim');
var doc_fieldpecan = document.getElementById('fieldPecan');
var doc_fieldroot = document.getElementById('fieldRoot');


/* UPDATE */

function initUpdate(){
	slowUpdate();
	fastUpdate();
}	

function slowUpdate(){
	updateEthAccount();
	updateContractBalance();
	updateGameRound();
	updateTreePot();
	updateWonkPot();
	updateJackPot();
	updateThronePot();
	updatePecanToWin();
	updatePecanGiven();
	updateLastRootPlant();
	updatePlayerBalance();
	updatePlayerRound();
	updatePlayerTree();
	updatePlayerPecan();
	updatePlayerEtherShare();
	updatePlayerPecanShare();
	updateRootPecan();
	//updatePlayerClaim();
	updateText();
	setTimeout(slowUpdate, 4000);
}

function fastUpdate(){
	updateField();
	fastupdateRootPecan();
	setTimeout(fastUpdate, 100);
}

//Updates all text from web3 calls
function updateText(){
	doc_contractBalance.innerHTML = a_contractBalance;
	doc_gameRound.innerHTML = a_gameRound;
	doc_roundPot.innerHTML = (a_jackPot / 5).toFixed(4);
	doc_treePot.innerHTML = a_treePot;
	doc_wonkPot.innerHTML = a_wonkPot;
	doc_thronePot.innerHTML = a_thronePot;
	doc_jackPot.innerHTML = a_jackPot;
	doc_pecanToWin.innerHTML = a_pecanToWin;
	doc_pecanGiven.innerHTML = a_pecanGiven;
	doc_lastRootPlant.innerHTML = computeLastRootPlant();
	doc_playerBalance.innerHTML = a_playerBalance;
	doc_playerRound.innerHTML = a_playerRound;
	doc_playerTree.innerHTML = a_playerTree;
	doc_playerPecan.innerHTML = a_playerPecan;
	//doc_playerLastClaim.innerHTML = a_playerLastClaim;
	doc_playerEtherShare.innerHTML = a_playerEtherShare;
	doc_playerPecanShare.innerHTML = a_playerPecanShare;
	doc_rootPecanForOneEther.innerHTML = a_rootPecanForOneEther;
}

function updateField(){
	f_pecan = document.getElementById('fieldPecan').value;
	f_root = document.getElementById('fieldRoot').value;
}

/* UTILITIES */

//Truncates ETH value to 3 decimals
function formatEthValue(ethstr){
    return parseFloat(parseFloat(ethstr).toFixed(3));
}

//Truncates ETH value to 6 decimals
function formatEthValue2(ethstr){
	return parseFloat(parseFloat(ethstr).toFixed(6));
}

/* CALCULATIONS */
function computeLastRootPlant(){
	var _now = Math.round((new Date()).getTime() / 1000);
	var _timeSinceLast = parseFloat(_now - a_lastRootPlant);
	
	var	_numhours = Math.floor(_timeSinceLast / 3600);
	var _numminutes = Math.floor((_timeSinceLast % 3600) / 60);
	var _numseconds = (_timeSinceLast % 3600) % 60;
	var _plantString = "";			
	if(_numhours > 0) {
		_plantString = _numhours + " hours and " + _numminutes + " minutes ago";
	} else if(_numminutes > 0) {
		_plantString = _numminutes + " minutes ago";
	} else {
		_plantString = "less than a minute ago";
	}
	
	return _plantString;		
}

function computePecanLeft(){
	a_pecanLeft = parseFloat(a_pecanToWin - a_pecanGiven).toFixed(0);
}

/* FAST LOCAL UPDATES */
function fastupdateRootPecan(){
	var _now = new Date().getTime();
	var _timeSinceLastMs = parseFloat(_now) - parseFloat(a_lastRootPlant * 1000);
	var _boostFactor = parseFloat((_timeSinceLastMs * 0.005) + parseFloat(1));
	var _reward = _boostFactor / 0.0005 / 1000;
	a_rootPecanForOneEther = _reward;
}
		
/* WEB3 CALLS */

//Current ETH address in use
function updateEthAccount(){
	m_account = web3.eth.accounts[0];
}

//Current ETH balance in contract
function updateContractBalance(){
	web3.eth.getBalance(contractAddress, function(error, result) {
		if(!error) {
			a_contractBalance = formatEthValue(web3.fromWei(result, 'ether')) 
		}
	});
}

//Current game round
function updateGameRound(){
	gameRound(function(result) {
		a_gameRound = result;
	});
}

//Current tree pot
function updateTreePot(){
	treePot(function(result) {
		a_treePot = formatEthValue(web3.fromWei(result,'ether'));
	});
}

//Current wonk pot
function updateWonkPot(){
	wonkPot(function(result) {
		a_wonkPot = formatEthValue(web3.fromWei(result,'ether'));
	});
}

//Current jackpot
function updateJackPot(){
	jackPot(function(result) {
		a_jackPot = formatEthValue(web3.fromWei(result,'ether'));
	});
}

//Current throne pot
function updateThronePot(){
	thronePot(function(result) {
		a_thronePot = formatEthValue(web3.fromWei(result,'ether'));
	});
}

//Current pecans to win
function updatePecanToWin(){
	pecanToWin(function(result) {
		a_pecanToWin = result;
	});
}

//Pecans given
function updatePecanGiven(){
	pecanGiven(function(result) {
		a_pecanGiven = result;
	});
}

//Last root plant
function updateLastRootPlant(){
	lastRootPlant(function(result) {
		a_lastRootPlant = result;
	});
}

//Current balance for player
function updatePlayerBalance(){
	GetMyBalance(function(result) {
		a_playerBalance = formatEthValue2(web3.fromWei(result,'ether'));
	});
}

//Current round for player
function updatePlayerRound(){
	GetMyRound(function(result) {
		a_playerRound = result;
	});
}		

//Current treeSize for player
function updatePlayerTree(){
	GetTree(m_account, function(result) {
		a_playerTree = result;
	});
}

//Current pecans for player
function updatePlayerPecan(){
	GetPecan(m_account, function(result) {
		a_playerPecan = result;
	});
}		

//Compute EtherShare
function updatePlayerEtherShare(){
	ComputeEtherShare(m_account, function(result) {
		a_playerEtherShare = parseFloat(web3.fromWei(result,'ether')).toFixed(10);
	});
}

//Compute PecanShare
function updatePlayerPecanShare(){
	ComputePecanShare(m_account, function(result) {
		a_playerPecanShare = result;
	});
}

//Compute PlantPecan
function updateRootPecan(){
	var weitospend =  web3.toWei(1,'ether');
	ComputePlantPecan(weitospend, function(result) {
		a_rootPecanForOneEther = result;
	});
}

/* WEB3 TRANSACTIONS */

//Give pecan
function webGivePecan(){
	GivePecan(f_pecan, function(){
	});
}

//Plant root
function webPlantRoot(){
	var weitospend = web3.toWei(f_root,'ether');
	PlantRoot(weitospend, function(){
	});
}

//Grow tree
function webGrowTree(){
	GrowTree(function(){
	});
}

//Claim share
function webClaimShare(){
	ClaimShare(function(){
	});
}

//Withdraw balance
function webWithdrawBalance(){
	WithdrawBalance(function(){
	});
}

//Pay Throne
function webPayThrone(){
	PayThrone(function(){
	});
}


/* CONTRACT ABI */
abiDefinition=[{"constant": false,"inputs": [],"name": "ClaimShare","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_pecanGift","type": "uint256"}],"name": "GivePecan","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "GrowTree","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "PayThrone","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "treesize","type": "uint256"}],"name": "PlantedRoot","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "pecan","type": "uint256"}],"name": "GavePecan","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "pecan","type": "uint256"}],"name": "ClaimedShare","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"},{"indexed": false,"name": "pecan","type": "uint256"}],"name": "GrewTree","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"}],"name": "JoinedRound","type": "event"},{"constant": false,"inputs": [],"name": "PlantRoot","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": false,"inputs": [],"name": "WithdrawBalance","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": true,"name": "round","type": "uint256"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "WonRound","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "WithdrewBalance","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "PaidThrone","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "player","type": "address"},{"indexed": false,"name": "eth","type": "uint256"}],"name": "BoostedPot","type": "event"},{"payable": true,"stateMutability": "payable","type": "fallback"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "ComputeEtherShare","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "ComputePecanShare","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputePecanToWin","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "ComputePlantBoostFactor","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "_msgValue","type": "uint256"}],"name": "ComputePlantPecan","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "ComputeShareBoostFactor","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "_pecanGift","type": "uint256"}],"name": "ComputeWonkTrade","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "gameRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMyBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "GetMyRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetPecan","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "adr","type": "address"}],"name": "GetTree","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "jackPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "lastClaim","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "lastRootPlant","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "pecan","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "PECAN_MIN_WIN","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "PECAN_WIN_FACTOR","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "pecanGiven","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "pecanToWin","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "playerBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "playerRound","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "REWARD_SIZE_ETH","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SECONDS_IN_DAY","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SECONDS_IN_HOUR","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "SNAILTHRONE","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "thronePot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "TREE_SIZE_COST","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "treePot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "address"}],"name": "treeSize","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "wonkPot","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}]

function ClaimShare(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ClaimShare.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ClaimShare ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GivePecan(_pecanGift,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.GivePecan.getData(_pecanGift);
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GivePecan ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GrowTree(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.GrowTree.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GrowTree ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function PayThrone(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.PayThrone.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('PayThrone ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function PlantRoot(eth,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.PlantRoot.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData,value: eth},
    function(error,result){
        if(!error){
            console.log('PlantRoot ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function WithdrawBalance(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.WithdrawBalance.getData();
    var endstr=web3.eth.sendTransaction({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('WithdrawBalance ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeEtherShare(adr,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputeEtherShare.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeEtherShare ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputePecanShare(adr,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputePecanShare.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputePecanShare ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputePecanToWin(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputePecanToWin.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputePecanToWin ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputePlantBoostFactor(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputePlantBoostFactor.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputePlantBoostFactor ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputePlantPecan(_msgValue,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputePlantPecan.getData(_msgValue);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputePlantPecan ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeShareBoostFactor(adr,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputeShareBoostFactor.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeShareBoostFactor ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function ComputeWonkTrade(_pecanGift,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.ComputeWonkTrade.getData(_pecanGift);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('ComputeWonkTrade ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function gameRound(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.gameRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('gameRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyBalance(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.GetMyBalance.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetMyBalance ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetMyRound(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.GetMyRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetMyRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetPecan(adr,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.GetPecan.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetPecan ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function GetTree(adr,callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.GetTree.getData(adr);
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('GetTree ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function jackPot(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.jackPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('jackPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function lastClaim(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.lastClaim.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('lastClaim ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function lastRootPlant(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.lastRootPlant.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('lastRootPlant ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function pecan(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.pecan.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('pecan ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function PECAN_MIN_WIN(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.PECAN_MIN_WIN.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('PECAN_MIN_WIN ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function PECAN_WIN_FACTOR(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.PECAN_WIN_FACTOR.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('PECAN_WIN_FACTOR ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function pecanGiven(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.pecanGiven.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('pecanGiven ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function pecanToWin(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.pecanToWin.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('pecanToWin ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function playerBalance(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.playerBalance.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('playerBalance ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function playerRound(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.playerRound.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('playerRound ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function REWARD_SIZE_ETH(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.REWARD_SIZE_ETH.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('REWARD_SIZE_ETH ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function SECONDS_IN_DAY(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.SECONDS_IN_DAY.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('SECONDS_IN_DAY ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function SECONDS_IN_HOUR(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.SECONDS_IN_HOUR.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('SECONDS_IN_HOUR ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function SNAILTHRONE(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.SNAILTHRONE.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('SNAILTHRONE ',result);
            callback(result)
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function thronePot(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.thronePot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('thronePot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function TREE_SIZE_COST(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.TREE_SIZE_COST.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('TREE_SIZE_COST ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function treePot(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.treePot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('treePot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function treeSize(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.treeSize.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('treeSize ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


function wonkPot(callback){
    var contractAbi = web3.eth.contract(abiDefinition);
    var myContract = contractAbi.at(contractAddress);
    var outputData = myContract.wonkPot.getData();
    var endstr=web3.eth.call({to:contractAddress, from:null, data: outputData},
    function(error,result){
        if(!error){
            console.log('wonkPot ',web3.toDecimal(result));
            callback(web3.toDecimal(result))
        }
        else{
            console.log('transaction failed with ',error.message)
        }
    });
}


