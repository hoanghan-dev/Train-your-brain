/**
 * BrainArena Mock Data Source
 * Dữ liệu mô phỏng tĩnh phục vụ chạy offline trên trình duyệt
 */

const STORAGE_KEYS = {
    PLAYER: 'brainarena_player',
    OPPONENT: 'brainarena_opponent',
    CURRENT_MATCH: 'brainarena_current_match',
    ROOM_DATA: 'brainarena_room_data',
    BATTLE_RESULT: 'brainarena_battle_result',
    IS_LOGGED_IN: 'brainarena_is_logged_in',
    LOGIN_TYPE: 'brainarena_login_type'
};

const INITIAL_PLAYER = {
    username: "BrainMaster",
    avatar: "⚡",
    level: 3,
    exp: 720,
    maxExp: 1000,
    brainPoints: 1250,
    rank: 18,
    cups: 1450,
    equippedBadge: "badge_speed_demon",
    challenges: {
        schulte: {
            level: 2,
            currentStreak: 1,
            bestTime: 12.4,
            totalPlays: 14
        },
        stroop: {
            level: 1,
            currentStreak: 0,
            bestScore: 280,
            totalPlays: 8
        }
    },
    equippedSkills: ["skill_hint", "skill_disrupt", "skill_shield"],
    unlockedSkills: ["skill_hint", "skill_disrupt", "skill_shield"],
    ownedBadges: ["badge_novice", "badge_speed_demon"],
    recentMatches: [
        { id: "m1", type: "PvP 1v1", challenge: "Schulte Table Lv.2", opponent: "NeuroAce", result: "VICTORY", time: "14.2s", points: "+50", date: "Hôm nay" },
        { id: "m2", type: "Solo", challenge: "Stroop Test Lv.1", opponent: "Solo Practice", result: "COMPLETED", time: "30s", points: "+25", date: "Hôm nay" },
        { id: "m3", type: "PvP 1v1", challenge: "Schulte Table Lv.1", opponent: "MindGamer99", result: "DEFEAT", time: "16.8s", points: "+15", date: "Hôm qua" }
    ]
};

const SKILLS_DATA = [
    {
        id: "skill_hint",
        name: "Linh Cảm (Hint)",
        type: "buff",
        icon: "bi-lightbulb-fill",
        badgeColor: "#38bdf8",
        desc: "Tự động phát sáng và làm nổi bật ô số tiếp theo trong 2.5 giây.",
        unlockLevel: 1,
        cooldown: 8,
        effectDesc: "+ Gợi ý mục tiêu kế tiếp"
    },
    {
        id: "skill_disrupt",
        name: "Nhiễu Sóng (Disrupt)",
        type: "debuff",
        icon: "bi-lightning-charge-fill",
        badgeColor: "#f43f5e",
        desc: "Làm rung lắc và mờ nhẹ màn hình đối thủ trong 1.5 giây.",
        unlockLevel: 2,
        cooldown: 12,
        effectDesc: "Đối thủ bị nhiễu loạn 1.5s"
    },
    {
        id: "skill_shield",
        name: "Khiên Tâm Trí (Shield)",
        type: "shield",
        icon: "bi-shield-shaded",
        badgeColor: "#10b981",
        desc: "Kích hoạt lá chắn bảo vệ, vô hiệu hóa 1 lần debuff từ đối phương trong 5 giây.",
        unlockLevel: 3,
        cooldown: 15,
        effectDesc: "Khiên phòng thủ sẵn sàng"
    },
    {
        id: "skill_auto",
        name: "Tốc Biến (Auto-Solve)",
        type: "buff",
        icon: "bi-fast-forward-fill",
        badgeColor: "#a855f7",
        desc: "Tự động kích hoạt thành công 1 mục tiêu tiếp theo ngay lập tức.",
        unlockLevel: 5,
        cooldown: 20,
        effectDesc: "+ Tự động hoàn thành 1 số"
    },
    {
        id: "skill_frost",
        name: "Đóng Băng (Frostbite)",
        type: "debuff",
        icon: "bi-snow2",
        badgeColor: "#06b6d4",
        desc: "Khóa thao tác của đối thủ trong 1.0 giây.",
        unlockLevel: 6,
        cooldown: 18,
        effectDesc: "Khóa đối phương 1 giây"
    }
];

const CHALLENGES_DATA = {
    schulte: {
        id: "schulte",
        name: "Bảng Schulte (Schulte Table)",
        desc: "Rèn luyện tầm nhìn bao quát và tốc độ xử lý thông tin bằng cách bấm lần lượt các số từ 1 đến N.",
        icon: "bi-grid-3x3",
        color: "#3b82f6",
        levels: [
            { level: 1, grid: "3x3 (1–9)", targetTime: 15, expReward: 100, pointsReward: 30, unlockReq: "Mở khóa sẵn" },
            { level: 2, grid: "4x4 (1–16)", targetTime: 25, expReward: 180, pointsReward: 50, unlockReq: "Schulte Lv.1 hoàn thành" },
            { level: 3, grid: "5x5 (1–25)", targetTime: 40, expReward: 300, pointsReward: 80, unlockReq: "Schulte Lv.2 hoàn thành" }
        ]
    },
    stroop: {
        id: "stroop",
        name: "Thử Thách Stroop (Stroop Test)",
        desc: "Cải thiện khả năng ức chế phản xạ sai: chọn chính xác màu mực thực tế của từ ngữ xuất hiện.",
        icon: "bi-palette2",
        color: "#ec4899",
        levels: [
            { level: 1, questions: 10, timePerQ: 3.5, expReward: 100, pointsReward: 30, unlockReq: "Mở khóa sẵn" },
            { level: 2, questions: 15, timePerQ: 2.8, expReward: 200, pointsReward: 60, unlockReq: "Stroop Lv.1 hoàn thành" },
            { level: 3, questions: 20, timePerQ: 2.0, expReward: 320, pointsReward: 90, unlockReq: "Stroop Lv.2 hoàn thành" }
        ]
    }
};

const BADGES_DATA = [
    {
        id: "badge_novice",
        name: "Tân Binh Trí Tuệ",
        icon: "🌱",
        desc: "Hoàn thành bài tập đầu tiên trong BrainArena.",
        price: 0,
        rarity: "Common",
        rarityColor: "#94a3b8"
    },
    {
        id: "badge_speed_demon",
        name: "Tia Chớp Phản Xạ",
        icon: "⚡",
        desc: "Đạt kỷ lục giải Schulte 3x3 dưới 15 giây.",
        price: 400,
        rarity: "Rare",
        rarityColor: "#38bdf8"
    },
    {
        id: "badge_eagle_eye",
        name: "Mắt Đại Bàng",
        icon: "🦅",
        desc: "Hoàn thành thử thách mà không bấm sai một lần nào.",
        price: 600,
        rarity: "Epic",
        rarityColor: "#a855f7"
    },
    {
        id: "badge_stroop_master",
        name: "Khắc Tinh Màu Sắc",
        icon: "🎨",
        desc: "Đạt chuỗi 15 câu trả lời đúng liên tiếp ở Stroop Test.",
        price: 800,
        rarity: "Epic",
        rarityColor: "#ec4899"
    },
    {
        id: "badge_pvp_warlord",
        name: "Chiến Thần Đấu Trường",
        icon: "👑",
        desc: "Đạt tỉ lệ thắng trên 60% trong chế độ đối kháng 1v1.",
        price: 1200,
        rarity: "Legendary",
        rarityColor: "#f59e0b"
    },
    {
        id: "badge_mind_iron",
        name: "Ý Chí Thép",
        icon: "🛡️",
        desc: "Chặn thành công kỹ năng debuff từ đối thủ trong trận đấu.",
        price: 500,
        rarity: "Rare",
        rarityColor: "#10b981"
    }
];

const MOCK_OPPONENTS = [
    { name: "NeuroAce", level: 3, rank: 17, avatar: "🦊", cups: 1480, winRate: "64%" },
    { name: "SynapsePro", level: 3, rank: 19, avatar: "🐯", cups: 1420, winRate: "58%" },
    { name: "FocusNinja", level: 4, rank: 14, avatar: "🦉", cups: 1560, winRate: "72%" },
    { name: "CortexClimber", level: 2, rank: 23, avatar: "🐼", cups: 1390, winRate: "52%" },
    { name: "CogniQueen", level: 3, rank: 16, avatar: "🦄", cups: 1495, winRate: "67%" }
];

const MOCK_LEADERBOARDS = {
    schulte: [
        { rank: 1, name: "VortexMind", time: "8.92s", level: 3, avatar: "🏆", badge: "badge_pvp_warlord" },
        { rank: 2, name: "FlashSynapse", time: "9.15s", level: 3, avatar: "🥈", badge: "badge_speed_demon" },
        { rank: 3, name: "DeepFocus_VN", time: "9.48s", level: 3, avatar: "🥉", badge: "badge_eagle_eye" },
        { rank: 4, name: "AlphaCortex", time: "10.02s", level: 3, avatar: "🐺", badge: "badge_speed_demon" },
        { rank: 5, name: "NovaThinker", time: "10.35s", level: 3, avatar: "🚀", badge: "badge_speed_demon" },
        { rank: 6, name: "MindOverMatter", time: "10.60s", level: 3, avatar: "🦁", badge: "badge_speed_demon" },
        { rank: 7, name: "HyperReflex", time: "10.88s", level: 3, avatar: "⚡", badge: "badge_eagle_eye" },
        { rank: 8, name: "ChronoMaster", time: "11.12s", level: 2, avatar: "⏱️", badge: "badge_novice" },
        { rank: 9, name: "MatrixRunner", time: "11.30s", level: 3, avatar: "🕶️", badge: "badge_speed_demon" },
        { rank: 10, name: "ZenGamer", time: "11.45s", level: 2, avatar: "🧘", badge: "badge_novice" },
        { rank: 11, name: "QuantumBrain", time: "11.60s", level: 3, avatar: "⚛️", badge: "badge_speed_demon" },
        { rank: 12, name: "ReflexKing", time: "11.75s", level: 2, avatar: "👑", badge: "badge_speed_demon" },
        { rank: 13, name: "SpeedyGonzales", time: "11.90s", level: 3, avatar: "🐭", badge: "badge_novice" },
        { rank: 14, name: "FocusNinja", time: "12.05s", level: 4, avatar: "🦉", badge: "badge_pvp_warlord" },
        { rank: 15, name: "CogniQueen", time: "12.18s", level: 3, avatar: "🦄", badge: "badge_speed_demon" },
        { rank: 16, name: "NeuroPulse", time: "12.25s", level: 3, avatar: "💥", badge: "badge_novice" },
        { rank: 17, name: "NeuroAce", time: "12.32s", level: 3, avatar: "🦊", badge: "badge_speed_demon" },
        { rank: 18, name: "BrainMaster (Bạn)", time: "12.40s", level: 3, avatar: "⚡", badge: "badge_speed_demon", isUser: true },
        { rank: 19, name: "SynapsePro", time: "12.55s", level: 3, avatar: "🐯", badge: "badge_novice" },
        { rank: 20, name: "LogicKnight", time: "12.70s", level: 2, avatar: "🛡️", badge: "badge_mind_iron" }
    ],
    stroop: [
        { rank: 1, name: "ColorChameleon", score: "480 pts", level: 3, avatar: "🏆", badge: "badge_stroop_master" },
        { rank: 2, name: "PrismGamer", score: "460 pts", level: 3, avatar: "🥈", badge: "badge_stroop_master" },
        { rank: 3, name: "ChromaMaster", score: "440 pts", level: 3, avatar: "🥉", badge: "badge_eagle_eye" },
        { rank: 4, name: "SpectralEyes", score: "410 pts", level: 3, avatar: "👁️", badge: "badge_stroop_master" },
        { rank: 5, name: "HueHero", score: "390 pts", level: 3, avatar: "🎨", badge: "badge_stroop_master" },
        { rank: 6, name: "FocusNinja", score: "375 pts", level: 4, avatar: "🦉", badge: "badge_pvp_warlord" },
        { rank: 7, name: "OpticalFlash", score: "360 pts", level: 2, avatar: "⚡", badge: "badge_speed_demon" },
        { rank: 8, name: "NeuroAce", score: "345 pts", level: 3, avatar: "🦊", badge: "badge_novice" },
        { rank: 9, name: "SynapsePro", score: "330 pts", level: 3, avatar: "🐯", badge: "badge_novice" },
        { rank: 10, name: "CogniQueen", score: "320 pts", level: 3, avatar: "🦄", badge: "badge_speed_demon" },
        { rank: 11, name: "AlphaCortex", score: "310 pts", level: 3, avatar: "🐺", badge: "badge_novice" },
        { rank: 12, name: "PixelThinker", score: "295 pts", level: 2, avatar: "👾", badge: "badge_novice" },
        { rank: 13, name: "BrainMaster (Bạn)", score: "280 pts", level: 1, avatar: "⚡", badge: "badge_speed_demon", isUser: true },
        { rank: 14, name: "CortexClimber", score: "270 pts", level: 2, avatar: "🐼", badge: "badge_novice" },
        { rank: 15, name: "LogicPulse", score: "260 pts", level: 2, avatar: "🌐", badge: "badge_novice" }
    ]
};
