import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { User, UserRole } from '@/lib/types'
import { GraduationCap } from '@phosphor-icons/react'

interface WelcomeScreenProps {
  onLogin: (user: User) => void
}

export default function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<UserRole>('student')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username.trim(),
      role,
      currentLevel: 'Beginner',
      createdAt: Date.now(),
      lastActive: Date.now(),
    }

    onLogin(newUser)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap size={32} weight="bold" className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">LearnEnglish</h1>
          <p className="text-muted-foreground text-lg">Your path to fluency starts here</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to begin your English learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-normal cursor-pointer">
                      Student - Learn and practice English
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher" className="font-normal cursor-pointer">
                      Teacher - Monitor student progress
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Get Started
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}