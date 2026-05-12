import { useState } from "react";
import { Camera, Loader2, Lock, Key, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface StudentProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onSaveAvatar: (avatarUrl: string) => Promise<void> | void;
  onSaveEmail: (email: string) => Promise<void> | void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void> | void;
}

export function StudentProfileModal({ 
  open, 
  onOpenChange, 
  profile, 
  onSaveAvatar,
  onSaveEmail,
  onChangePassword 
}: StudentProfileModalProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValue, setEmailValue] = useState(profile.email);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isEmailChanged = emailValue !== profile.email;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarPreview) return;
    
    setIsLoading(true);
    try {
      await onSaveAvatar(avatarPreview);
      toast.success('Profile photo updated');
      setAvatarPreview(null);
    } catch (error) {
      toast.error('Failed to update profile photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!emailValue.trim()) {
      toast.error('Email is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSavingEmail(true);
    try {
      await onSaveEmail(emailValue.trim());
      toast.success('Email updated successfully');
    } catch (error) {
      toast.error('Failed to update email');
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword.trim()) {
      toast.error('Current password is required');
      return;
    }
    
    if (!newPassword.trim()) {
      toast.error('New password is required');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClose = () => {
    setAvatarPreview(null);
    setEmailValue(profile.email);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Update your profile photo, email, or change your password.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Photo Section */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Profile Photo</h4>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{profile.name}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Name managed by admin</span>
                </div>
              </div>
            </div>
            {avatarPreview && (
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveAvatar}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Photo
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setAvatarPreview(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Email Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Email Address</h4>
            </div>
            
            <div className="space-y-3">
              <Input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Enter your email"
              />
              {isEmailChanged && (
                <Button 
                  size="sm"
                  onClick={handleSaveEmail}
                  disabled={isSavingEmail}
                >
                  {isSavingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Email
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Security</h4>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button 
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full"
              >
                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </div>
            
            {/* Password Recovery Notice */}
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Forgot your password?</p>
                <p className="mt-1">
                  Contact your administrator to reset your password. Self-service password recovery is not available.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
