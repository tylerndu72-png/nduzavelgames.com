import React, { useState, useEffect } from 'react';
import {
  User,
  Project,
  OwnerProfile,
  SiteAnnouncement,
  ContactSubmission,
} from './types.ts';
import {
  AppStorage,
  INITIAL_OWNER_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_USERS,
} from './utils/storage.ts';

// Components
import { Navbar } from './components/Navbar.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { NotificationCenter } from './components/NotificationCenter.tsx';
import { LegalModal } from './components/LegalModals.tsx';

// Views
import { HomeView } from './views/HomeView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { StudioView } from './views/StudioView.tsx';
import { CommunityView } from './views/CommunityView.tsx';
import { VaultView } from './views/VaultView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { OwnerDashboardView } from './views/OwnerDashboardView.tsx';
import { MemberDashboardView } from './views/MemberDashboardView.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => AppStorage.getCurrentUser());
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() =>
    AppStorage.getOwnerProfile()
  );
  const [projects, setProjects] = useState<Project[]>(() => AppStorage.getProjects());
  const [announcements] = useState<SiteAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [users, setUsers] = useState<User[]>(() => AppStorage.getUsers());
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(() =>
    AppStorage.getContactSubmissions()
  );

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Real-time broadcast channel sync
  useEffect(() => {
    AppStorage.initBroadcast((event) => {
      const type = event.data?.type;
      if (type === 'OWNER_PROFILE_UPDATED') {
        setOwnerProfile(AppStorage.getOwnerProfile());
      } else if (type === 'PROJECTS_UPDATED') {
        setProjects(AppStorage.getProjects());
      } else if (type === 'AUTH_CHANGED') {
        setCurrentUser(AppStorage.getCurrentUser());
      } else if (type === 'USERS_UPDATED') {
        setUsers(AppStorage.getUsers());
      } else if (type === 'CONTACT_SUBMITTED' || type === 'CONTACT_UPDATED') {
        setContactSubmissions(AppStorage.getContactSubmissions());
      }
    });

    // Check URL parameters (e.g. ?autostart=1 or ?view=studio)
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam) {
      setCurrentView(viewParam);
    }
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    AppStorage.setCurrentUser(null);
    setCurrentUser(null);
    if (currentView === 'owner-dashboard' || currentView === 'member-dashboard') {
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onLogout={handleLogout}
        unreadCount={announcements.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full" id="main-content">
        {currentView === 'home' && (
          <HomeView
            owner={ownerProfile}
            projects={projects}
            announcements={announcements}
            onNavigate={handleNavigate}
            onOpenContact={() => handleNavigate('contact')}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            owner={ownerProfile}
            isOwner={currentUser?.role === 'owner'}
            onSaveProfile={(newProf) => {
              setOwnerProfile(newProf);
              AppStorage.saveOwnerProfile(newProf);
            }}
            onOpenContact={() => handleNavigate('contact')}
          />
        )}

        {currentView === 'studio' && (
          <StudioView
            projects={projects}
            onOpenContact={() => handleNavigate('contact')}
          />
        )}

        {currentView === 'community' && (
          <CommunityView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'vault' && (
          <VaultView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'contact' && (
          <ContactView ownerEmail={ownerProfile.email} />
        )}

        {currentView === 'owner-dashboard' && (
          <OwnerDashboardView
            owner={ownerProfile}
            projects={projects}
            users={users}
            contactSubmissions={contactSubmissions}
            onSaveOwnerProfile={(newProf) => {
              setOwnerProfile(newProf);
              AppStorage.saveOwnerProfile(newProf);
            }}
            onSaveProjects={(newProjs) => {
              setProjects(newProjs);
              AppStorage.saveProjects(newProjs);
            }}
            onSaveUsers={(newUsers) => {
              setUsers(newUsers);
              AppStorage.saveUsers(newUsers);
            }}
          />
        )}

        {currentView === 'member-dashboard' && currentUser && (
          <MemberDashboardView
            currentUser={currentUser}
            projects={projects}
            onNavigate={handleNavigate}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
            }}
          />
        )}
      </main>

      {/* Modern Footer with Attributable Owner Credits */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Mobile Sticky Action Bar */}
      <MobileNav
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        vaultItems={AppStorage.getVaultItems()}
        isOwner={currentUser?.role === 'owner'}
        onNavigate={handleNavigate}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        announcements={announcements}
        onNavigate={handleNavigate}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
