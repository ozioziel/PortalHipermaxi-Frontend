import React from 'react';
import type { ContactRole } from '../types/providerOnboarding.types';

interface Props { contacts: ContactRole[]; onChange: (c:ContactRole,i:number)=>void }

export const ContactRolesTable: React.FC<Props> = ({contacts, onChange}) => {
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombre responsable</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c,i)=> (
            <tr key={i}>
              <td>{c.role}</td>
              <td><input value={c.name} onChange={e=>onChange({...c,name:e.target.value},i)} /></td>
              <td><input value={c.email} onChange={e=>onChange({...c,email:e.target.value},i)} /></td>
              <td><input value={c.phone} onChange={e=>onChange({...c,phone:e.target.value},i)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactRolesTable;
