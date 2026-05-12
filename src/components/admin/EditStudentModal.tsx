 import { useState } from "react";
 import { User, Loader2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { toast } from "sonner";
 
 interface EditStudentModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   student: {
     id: string;
     name: string;
     email: string;
     registrationNumber?: string;
   };
   onSave: (data: { name: string; email: string }) => Promise<void> | void;
 }
 
 export function EditStudentModal({ 
   open, 
   onOpenChange, 
   student, 
   onSave 
 }: EditStudentModalProps) {
   const [name, setName] = useState(student.name);
   const [email, setEmail] = useState(student.email);
   const [isLoading, setIsLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!name.trim()) {
       toast.error('Name is required');
       return;
     }
     
     if (!email.trim()) {
       toast.error('Email is required');
       return;
     }
     
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       toast.error('Please enter a valid email address');
       return;
     }
 
     setIsLoading(true);
     try {
       await onSave({
         name: name.trim(),
         email: email.trim(),
       });
       toast.success('Student details updated');
       onOpenChange(false);
     } catch (error) {
       toast.error('Failed to update student details');
     } finally {
       setIsLoading(false);
     }
   };
 
   // Reset form when student changes
   useState(() => {
     setName(student.name);
     setEmail(student.email);
   });
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Edit Student Details</DialogTitle>
           <DialogDescription>
             Update student name and email. Registration number cannot be changed.
           </DialogDescription>
         </DialogHeader>
         
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Registration Number (Read-only) */}
           {student.registrationNumber && (
             <div className="space-y-2">
               <Label className="text-muted-foreground">Registration Number</Label>
               <p className="font-mono text-sm text-foreground bg-muted/50 px-3 py-2 rounded-md">
                 {student.registrationNumber}
               </p>
             </div>
           )}
           
           <div className="space-y-2">
             <Label htmlFor="name" className="flex items-center gap-2">
               <User className="h-4 w-4" />
               Full Name
             </Label>
             <Input
               id="name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Enter student's full name"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="email">Email Address</Label>
             <Input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Enter email address"
             />
           </div>
 
           <DialogFooter>
             <Button
               type="button"
               variant="outline"
               onClick={() => onOpenChange(false)}
               disabled={isLoading}
             >
               Cancel
             </Button>
             <Button type="submit" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Save Changes
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 }