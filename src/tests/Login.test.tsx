import {describe, expect, test, vi} from 'vitest';
import axios from 'axios';
import type { User } from './types/User.type';
// mock the axios module
// to implement
vi.mock('axios');
describe('Login Component', ()=>{
    test('should render the login form', ()=>{

    })  
    test('check multiple fields', async ()=>{
        // mock the axios post request
        const User: User= {
            username: 'testuser',
            password: 'testpassword',
            role: 'admin',
            patientId: '983a3f48-58db-44af-a6ab-2bc56d19fe1c',
            isActive: true
        };
        expect.soft(User.username).toBe('testuser');
        expect.soft(User.password).toBe('testpassword');
        expect.soft(User.role).toBe('admin');
        expect.soft(User.patientId).toBe('983a3f48-58db-44af-a6ab-2bc56d19fe1c');
        expect.soft(User.isActive).toBe(true);
    })


    test('fetches user by id', async()=>{
        const user = await fetchData('983a3f48-58db-44af-a6ab-2bc56d19fe1c');
        expect(user.name).toBe('test');
    })
    test('rejects with an error', async()=>{
        await expect(fetchInvalidUser()).rejects.toThrow('Invalid ID');
    })

    
})  

// function to mock the request 
function fetchData(id: string): Promise<{id: string, name: string}> {
    return Promise.resolve({id, name: 'test'});
}
function fetchInvalidUser(): Promise<{id: string, name: string}> {
    return Promise.reject(new Error('Invalid ID'));
}