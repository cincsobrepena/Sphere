import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';
import { AuthProvider } from './components/AuthProvider';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Root = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      {user ? <App /> : <AuthProvider />}
    </DndProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
