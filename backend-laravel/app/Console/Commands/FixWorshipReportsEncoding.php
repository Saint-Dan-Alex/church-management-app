<?php

namespace App\Console\Commands;

use App\Models\WorshipReport;
use Illuminate\Console\Command;

class FixWorshipReportsEncoding extends Command
{
    protected $signature = 'worship:fix-encoding';
    protected $description = 'Fix double-encoded JSON fields in worship reports';

    public function handle()
    {
        $this->info('Fixing worship reports encoding...');
        
        $reports = WorshipReport::all();
        $fixed = 0;
        
        foreach ($reports as $report) {
            $updated = false;
            
            // Fix orateurs
            if ($report->orateurs && is_string($report->orateurs)) {
                $decoded = $this->fixEncoding($report->orateurs);
                if ($decoded !== null) {
                    $report->orateurs = json_encode($decoded);
                    $updated = true;
                }
            }
            
            // Fix moderateurs
            if ($report->moderateurs && is_string($report->moderateurs)) {
                $decoded = $this->fixEncoding($report->moderateurs);
                if ($decoded !== null) {
                    $report->moderateurs = json_encode($decoded);
                    $updated = true;
                }
            }
            
            // Fix assistants
            if ($report->assistants && is_string($report->assistants)) {
                $decoded = $this->fixEncoding($report->assistants);
                if ($decoded !== null) {
                    $report->assistants = json_encode($decoded);
                    $updated = true;
                }
            }
            
            if ($updated) {
                $report->save();
                $fixed++;
                $this->line("Fixed report: {$report->id}");
            }
        }
        
        $this->info("Fixed {$fixed} reports out of {$reports->count()} total.");
        return 0;
    }
    
    private function fixEncoding($value)
    {
        if (!$value) return null;
        
        // Try to decode multiple times until we get an array
        $decoded = $value;
        $attempts = 0;
        
        while (is_string($decoded) && $attempts < 5) {
            try {
                $temp = json_decode($decoded, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $decoded = $temp;
                } else {
                    break;
                }
            } catch (\Exception $e) {
                break;
            }
            $attempts++;
        }
        
        // If we got an array, return it
        if (is_array($decoded)) {
            return $decoded;
        }
        
        return null;
    }
}
