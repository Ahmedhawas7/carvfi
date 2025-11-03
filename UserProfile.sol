// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserProfile {
    struct Profile {
        string username;
        string avatar;
        string bio;
        uint256 joinDate;
        uint256 reputation;
        string[] socialLinks;
        bool isVerified;
        uint256 totalPoints;
    }

    struct AIChatSession {
        string[] messages;
        uint256 lastActivity;
        bool isActive;
    }

    mapping(address => Profile) public profiles;
    mapping(address => AIChatSession) public aiSessions;
    mapping(address => uint256) public lastInteraction;
    
    address public owner;
    uint256 public totalUsers;

    event ProfileCreated(address indexed user, string username);
    event ProfileUpdated(address indexed user);
    event AIChatStarted(address indexed user);
    event ReputationUpdated(address indexed user, uint256 newReputation);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRegistered() {
        require(bytes(profiles[msg.sender].username).length > 0, "Not registered");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProfile(string memory _username, string memory _bio) external {
        require(bytes(_username).length >= 3, "Username too short");
        require(bytes(profiles[msg.sender].username).length == 0, "Profile exists");
        
        profiles[msg.sender] = Profile({
            username: _username,
            avatar: "",
            bio: _bio,
            joinDate: block.timestamp,
            reputation: 100,
            socialLinks: new string[](0),
            isVerified: false,
            totalPoints: 0
        });

        totalUsers++;
        emit ProfileCreated(msg.sender, _username);
    }

    function updateProfile(string memory _avatar, string memory _bio, string[] memory _socialLinks) external onlyRegistered {
        Profile storage profile = profiles[msg.sender];
        profile.avatar = _avatar;
        profile.bio = _bio;
        profile.socialLinks = _socialLinks;
        
        emit ProfileUpdated(msg.sender);
    }

    function startAIChat() external onlyRegistered {
        aiSessions[msg.sender] = AIChatSession({
            messages: new string[](0),
            lastActivity: block.timestamp,
            isActive: true
        });

        // مكافأة على بدء محادثة AI
        profiles[msg.sender].totalPoints += 10;
        emit AIChatStarted(msg.sender);
    }

    function addAIMessage(string memory _message) external onlyRegistered {
        require(aiSessions[msg.sender].isActive, "No active AI session");
        
        aiSessions[msg.sender].messages.push(_message);
        aiSessions[msg.sender].lastActivity = block.timestamp;

        // مكافأة على التفاعل مع AI
        profiles[msg.sender].totalPoints += 5;
    }

    function detectBotBehavior(address _user) external view returns (bool) {
        // محاكاة نظام كشف الروبوتات
        uint256 timeSinceLastInteraction = block.timestamp - lastInteraction[_user];
        return timeSinceLastInteraction < 1 seconds; // نشاط مريب
    }

    function updateReputation(address _user, uint256 _reputation) external onlyOwner {
        profiles[_user].reputation = _reputation;
        emit ReputationUpdated(_user, _reputation);
    }

    function getUserProfile(address _user) external view returns (Profile memory) {
        return profiles[_user];
    }

    function getAIChatSession(address _user) external view returns (AIChatSession memory) {
        return aiSessions[_user];
    }
}
