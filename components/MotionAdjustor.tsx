import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, Play } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AnimationConfig {
  type: string;
  duration: number;
  ease: string;
  delay: number;
  repeat: number;
  bounce: number;
  damping: number;
  stiffness: number;
  mass: number;
  velocity: number;
  useSpring: boolean;
}

const animationTypes = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slide: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
  },
  flip: {
    initial: { rotateY: 180, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
  },
  bounce: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  expand: {
    initial: { scale: 0, rotate: 180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
  },
  elastic: {
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1 },
  }
};

const defaultValues: AnimationConfig = {
  type: 'fade',
  duration: 0.5,
  ease: 'easeOut',
  delay: 0,
  repeat: 0,
  bounce: 0.25,
  damping: 10,
  stiffness: 100,
  mass: 1,
  velocity: 0,
  useSpring: false
};

const easeOptions = [
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'circIn',
  'circOut',
  'circInOut',
  'backIn',
  'backOut',
  'backInOut',
  'anticipate',
  'bounceIn',
  'bounceOut',
  'bounceInOut'
] as const;

const MotionAdjustor = ({ value = {}, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0); // Key for forcing re-render
  const currentConfig = { ...defaultValues, ...value };

  const handleChange = (field: keyof AnimationConfig, newValue: any) => {
    const updatedConfig = {
      ...currentConfig,
      [field]: newValue,
    };
    onChange?.(updatedConfig);
  };

  const handlePreview = () => {
    setKey(prev => prev + 1); // Increment key to force re-render
  };

  const getTransition = () => {
    if (currentConfig.useSpring) {
      return {
        type: "spring",
        stiffness: currentConfig.stiffness,
        damping: currentConfig.damping,
        mass: currentConfig.mass,
        velocity: currentConfig.velocity,
        bounce: currentConfig.bounce,
        restDelta: 0.001
      };
    }
    
    return {
      duration: currentConfig.duration,
      ease: currentConfig.ease,
      delay: currentConfig.delay,
      repeat: currentConfig.repeat,
      repeatType: currentConfig.repeat > 0 ? "reverse" as const : undefined,
    };
  };

  return (
    <div className="w-full overflow-hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between items-center">
            <span>Animation Settings</span>
            <Settings className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-96 overflow-hidden">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Animation Type</Label>
              <Select 
                value={currentConfig.type} 
                onValueChange={(v) => handleChange('type', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(animationTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Use Spring Animation</Label>
                <Switch
                  checked={currentConfig.useSpring}
                  onCheckedChange={(checked) => handleChange('useSpring', checked)}
                />
              </div>
            </div>

            {!currentConfig.useSpring ? (
              <>
                              <div className="space-y-2">
                  <Label>Easing</Label>
                  <Select 
                    value={currentConfig.ease} 
                    onValueChange={(v) => handleChange('ease', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {easeOptions.map((ease) => (
                        <SelectItem key={ease} value={ease}>
                          {ease}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration ({currentConfig.duration}s)</Label>
                  <Slider
                    value={[currentConfig.duration]}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onValueChange={(v) => handleChange('duration', v[0])}
                  />
                </div>


              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Stiffness ({currentConfig.stiffness})</Label>
                  <Slider
                    value={[currentConfig.stiffness]}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={(v) => handleChange('stiffness', v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Damping ({currentConfig.damping})</Label>
                  <Slider
                    value={[currentConfig.damping]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(v) => handleChange('damping', v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mass ({currentConfig.mass})</Label>
                  <Slider
                    value={[currentConfig.mass]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(v) => handleChange('mass', v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bounce ({currentConfig.bounce})</Label>
                  <Slider
                    value={[currentConfig.bounce]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(v) => handleChange('bounce', v[0])}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Delay ({currentConfig.delay}s)</Label>
              <Slider
                value={[currentConfig.delay]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(v) => handleChange('delay', v[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Repeat (0 = no repeat)</Label>
              <Input
                type="number"
                value={currentConfig.repeat}
                onChange={(e) => handleChange('repeat', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>

            <Button onClick={handlePreview} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Preview Animation
            </Button>

            <div className="p-4 border rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={key}
                  className="w-full h-20 bg-blue-500 rounded-lg"
                  initial={animationTypes[currentConfig.type].initial}
                  animate={animationTypes[currentConfig.type].animate}
                  transition={getTransition()}
                />
              </AnimatePresence>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MotionAdjustor;