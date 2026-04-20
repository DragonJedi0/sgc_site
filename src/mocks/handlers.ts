import { http, HttpResponse } from 'msw';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Mock data
const mockPersonnel = [
    { id: '1', rank: 'Colonel', role: 'Team Leader', team: 'SG-1', status: 'active', prefix: 'Mr.', first_name: 'Jack', middle_name: '', last_name: "O'Neill", suffix: '', personnel_type: 'military' },
    { id: '2', rank: '', role: 'Archeology Expert', team: 'SG-1', status: 'active', prefix: 'Dr.', first_name: 'Daniel', middle_name: '', last_name: 'Jackson', suffix: '', personnel_type: 'civilian' },
    { id: '3', rank: 'Second Lieutenant', role: 'Combat Support', team: 'SG-2', status: 'active', prefix: 'Mr.', first_name: 'Carl', middle_name: 'John', last_name: 'Baker', suffix: 'III', personnel_type: 'military' },
];

export const handlers = [
  http.get(`${supabaseUrl}/rest/v1/personnel`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // 'id' => 'eq.{id}'
    const index = id ? Number(id.slice(3)) - 1 : 0;

    if(id) return HttpResponse.json(mockPersonnel[index]);

    return HttpResponse.json(mockPersonnel);
  }),
];