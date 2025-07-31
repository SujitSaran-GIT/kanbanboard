import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../redux/slices/taskSlice';
import KanbanBoard from '../components/tasks/KanbanBoard';

const palette = ['#F75A5A', '#FFA955', '#FFD63A', '#6DE1D2'];

function formatNameFromEmailLocal(email) {
  const m = email.match(/^(.+?)(?=@)/);
  if (!m) return '';
  let local = m[1];

  // Remove digits and non-letters
  const clean = local.replace(/[^A-Za-z]/g, '');
  if (!clean) return '';

  // Split in half for two name parts
  const len = clean.length;
  const mid = Math.ceil(len / 2);
  const part1 = clean.slice(0, mid);
  const part2 = clean.slice(mid);

  // Format uppercase
  return `${part1.toUpperCase()} ${part2.toUpperCase()}`;
}


export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { items: tasks, loading } = useSelector(state => state.tasks);
  console.log(user)

  

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const email = user?.email || ''
  const formatEmail = formatNameFromEmailLocal(email)

  // Calculate stats from tasks
  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: palette[0] },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Done').length, color: palette[1] },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: palette[2] },
    { label: 'Pending', value: tasks.filter(t => t.status === 'To Do').length, color: palette[3] },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: palette[0] }}>
          Welcome{user ? `, ${formatEmail || ''}` : ''}!
        </h1>
        <p className="text-white/80 text-lg">Here's your productivity overview</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-6 text-center shadow-lg" style={{ background: s.color, color: '#fff' }}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-lg mt-2">{s.label}</div>
          </div>
        ))}
      </div>
      <div>
        <KanbanBoard tasks={tasks} loading={loading} />
      </div>
    </div>
  );
} 