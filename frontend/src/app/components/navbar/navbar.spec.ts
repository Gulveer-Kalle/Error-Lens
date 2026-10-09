import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let logoutCalled: boolean;

  beforeEach(async () => {
    logoutCalled = false;
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([{ path: 'account/login', children: [] }]),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated$: of(false),
            userEmail$: of(null),
            logout: () => {
              logoutCalled = true;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear the session when logging out', () => {
    component.logout();

    expect(logoutCalled).toBe(true);
  });
});
