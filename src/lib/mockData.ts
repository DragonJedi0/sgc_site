// Mock data 
export const mockEntry = {
    prefix: "Mr.",
    first_name: "Samuel",
    middle_name: "FishHawk",
    last_name: "Ybarra",
    suffix: "Jr.",
    personnel_type: "military",
    rank: "Second Lieutenant",
    team: "SG-2",
    role: "Technical Expert",
    status: "active"
};

export const mockPersonnel = [
    {
        id: '1',
        rank: 'Colonel',
        role: 'Team Leader',
        team: 'SG-1',
        status: 'active',
        prefix: 'Mr.',
        first_name: 'Jack',
        middle_name: '',
        last_name: "O'Neill",
        suffix: '',
        personnel_type: 'military'
    },
    {
        id: '2',
        rank: null,
        role: 'Archeology Expert',
        team: 'SG-1',
        status: 'active',
        prefix: 'Dr.',
        first_name: 'Daniel',
        middle_name: '',
        last_name: 'Jackson',
        suffix: 'PHD',
        personnel_type: 'civilian'
    },
    {
        id: '3',
        rank: 'Second Lieutenant',
        role: 'Combat Support',
        team: 'SG-2',
        status: 'active',
        prefix: 'Mr.',
        first_name: 'Carl',
        middle_name: 'John',
        last_name: 'Baker',
        suffix: 'III',
        personnel_type: 'military'
    },
    {
        id: '4',
        rank: null,
        role: 'Computer Expert',
        team: 'SG-2',
        status: 'active',
        prefix: 'Dr.',
        first_name: 'Samantha',
        middle_name: 'Alexandra',
        last_name: 'Shepard',
        suffix: 'PHD',
        personnel_type: 'civilian'
    },
    {
        id: '5',
        rank: '',
        role: 'broken',
        team: '',
        status: 'active',
        prefix: '',
        first_name: 'test',
        middle_name: '',
        last_name: 'test',
        suffix: '',
        personnel_type: 'military'
    },
    {
        id: '6',
        rank: null,
        role: 'Combat Expert',
        team: 'SG-1',
        status: 'active',
        prefix: null,
        first_name: "Teal'c",
        middle_name: '',
        last_name: null,
        suffix: '',
        personnel_type: 'civilian'
    }
];

export const e2eTestRecords = {
    e2eTestRec : mockEntry,
    e2eTestRec2: {
        rank: 'Major',
        role: 'Combat Support',
        team: 'SG-2',
        status: 'kia',
        prefix: 'Mr.',
        first_name: 'Carl',
        middle_name: 'John',
        last_name: 'Baker',
        suffix: 'III',
        personnel_type: 'military'
    },
    e2eTestRec3 : {
        rank: null,
        role: 'Computer Expert',
        team: 'SG-2',
        status: 'inactive',
        prefix: 'Dr.',
        first_name: 'Samantha',
        middle_name: 'Alexandra',
        last_name: 'Shepard',
        suffix: 'PHD',
        personnel_type: 'civilian'
    },
    e2eTestMilitary: {
        rank: 'Airman Basic',
        role: 'Test Role',
        team: 'Test Team',
        status: 'active',
        prefix: 'Mr.',
        first_name: 'E2E',
        middle_name: 'Full',
        last_name: 'Test',
        suffix: 'Tester',
        personnel_type: 'military'
    },
    e2eTestCivilian : {
        rank: null,
        role: 'Test Role',
        team: 'Test Team',
        status: 'active',
        prefix: 'Dr.',
        first_name: 'E2E',
        middle_name: 'Full',
        last_name: 'Test',
        suffix: 'PHD',
        personnel_type: 'civilian'
    }
}