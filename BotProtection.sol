// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BotProtection {
    struct UserBehavior {
        uint256 interactionCount;
        uint256 lastInteraction;
        uint256[] interactionTimestamps;
        bool isSuspicious;
    }

    mapping(address => UserBehavior) public userBehaviors;
    mapping(address => bool) public blacklisted;
    
    address public owner;
    uint256 public constant MAX_INTERACTIONS_PER_MINUTE = 10;

    event UserFlagged(address indexed user, string reason);
    event UserBlacklisted(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier notBlacklisted() {
        require(!blacklisted[msg.sender], "Address blacklisted");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordInteraction(address _user) external returns (bool) {
        UserBehavior storage behavior = userBehaviors[_user];
        
        // تحديث السلوك
        behavior.interactionCount++;
        behavior.lastInteraction = block.timestamp;
        behavior.interactionTimestamps.push(block.timestamp);
        
        // تحليل السلوك
        bool isBot = analyzeBehavior(_user);
        
        if (isBot && !blacklisted[_user]) {
            blacklisted[_user] = true;
            behavior.isSuspicious = true;
            emit UserBlacklisted(_user);
        }
        
        return !isBot;
    }

    function analyzeBehavior(address _user) internal view returns (bool) {
        UserBehavior storage behavior = userBehaviors[_user];
        
        if (behavior.interactionTimestamps.length < 2) {
            return false;
        }
        
        // تحليل تكرار التفاعلات
        uint256 recentInteractions = 0;
        for (uint i = 0; i < behavior.interactionTimestamps.length; i++) {
            if (block.timestamp - behavior.interactionTimestamps[i] <= 60 seconds) {
                recentInteractions++;
            }
        }
        
        // إذا كان عدد التفاعلات أكثر من المسموح في دقيقة
        if (recentInteractions > MAX_INTERACTIONS_PER_MINUTE) {
            emit UserFlagged(_user, "High frequency interactions");
            return true;
        }
        
        // تحليل الأنماط المنتظمة (روبوتات)
        if (hasRegularPattern(behavior.interactionTimestamps)) {
            emit UserFlagged(_user, "Regular pattern detected");
            return true;
        }
        
        return false;
    }

    function hasRegularPattern(uint256[] memory timestamps) internal pure returns (bool) {
        if (timestamps.length < 3) return false;
        
        // تحليل إذا كانت الفترات بين التفاعلات منتظمة
        uint256[] memory intervals = new uint256[](timestamps.length - 1);
        for (uint i = 1; i < timestamps.length; i++) {
            intervals[i-1] = timestamps[i] - timestamps[i-1];
        }
        
        // إذا كانت الفترات متشابهة جداً، احتمال روبوت
        uint256 baseInterval = intervals[0];
        for (uint i = 1; i < intervals.length; i++) {
            if (intervals[i] < baseInterval * 80 / 100 || intervals[i] > baseInterval * 120 / 100) {
                return false;
            }
        }
        
        return true;
    }

    function removeFromBlacklist(address _user) external onlyOwner {
        blacklisted[_user] = false;
        userBehaviors[_user].isSuspicious = false;
    }

    function getUserBehavior(address _user) external view returns (UserBehavior memory) {
        return userBehaviors[_user];
    }
}
