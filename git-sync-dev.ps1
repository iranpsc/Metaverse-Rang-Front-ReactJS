
$ErrorActionPreference = "Stop"

function Invoke-Git {
    param([string[]]$GitArgs)

    & git @GitArgs

    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($GitArgs -join ' ')"
    }
}

$originalBranch = $null

try {
    # Get current branch
    $originalBranch = (& git branch --show-current).Trim()

    if ($LASTEXITCODE -ne 0 -or !$originalBranch) {
        throw "Could not detect current branch."
    }

    if ($originalBranch -eq "dev") {
        throw "You are already on dev. Switch to your feature branch first."
    }

    Write-Host "`nCurrent branch: $originalBranch" -ForegroundColor Cyan

    # Add changes
    Write-Host "`n[1/8] Adding changes..." -ForegroundColor Yellow
    Invoke-Git -GitArgs @("add", ".")

    # Check staged changes
    & git diff --cached --quiet
    $hasChanges = ($LASTEXITCODE -eq 1)

    if ($LASTEXITCODE -gt 1) {
        throw "Could not inspect staged changes."
    }

    if ($hasChanges) {
        # Get commit message
        $commitMessage = Read-Host "`nEnter commit message"

        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            throw "Commit message cannot be empty."
        }

        # Commit
        Write-Host "`n[2/8] Committing..." -ForegroundColor Yellow
        Invoke-Git -GitArgs @("commit", "-m", $commitMessage)
    }
    else {
        Write-Host "No new changes to commit." -ForegroundColor DarkYellow
    }

    # Push current branch
    Write-Host "`n[3/8] Pushing $originalBranch..." -ForegroundColor Yellow
    Invoke-Git -GitArgs @("push", "-u", "origin", $originalBranch)

    # Fetch latest remote branches
    Write-Host "`n[4/8] Fetching origin..." -ForegroundColor Yellow
    Invoke-Git -GitArgs @("fetch", "origin")

    # Switch to dev
    Write-Host "`n[5/8] Switching to dev..." -ForegroundColor Yellow

    & git show-ref --verify --quiet refs/heads/dev
    $localDevExists = ($LASTEXITCODE -eq 0)

    if ($localDevExists) {
        Invoke-Git -GitArgs @("switch", "dev")
    }
    else {
        & git show-ref --verify --quiet refs/remotes/origin/dev

        if ($LASTEXITCODE -ne 0) {
            throw "Remote branch origin/dev does not exist."
        }

        Invoke-Git -GitArgs @("switch", "--track", "-c", "dev", "origin/dev")
    }

    # Pull latest dev changes (fast-forward only)
    Write-Host "`n[6/8] Updating dev..." -ForegroundColor Yellow
    Invoke-Git -GitArgs @("pull", "--ff-only", "origin", "dev")

    # Merge original branch into dev
    Write-Host "`n[7/8] Merging $originalBranch into dev..." -ForegroundColor Yellow
    Invoke-Git -GitArgs @("merge", "--no-edit", $originalBranch)

    # Push dev
    Write-Host "`n[8/8] Pushing dev..." -ForegroundColor Yellow
    Invoke-Git -GitArgs @("push", "origin", "dev")

    Write-Host "`nSuccessfully synchronized with dev!" -ForegroundColor Green
}
catch {
    Write-Host "`nERROR: $_" -ForegroundColor Red

    # Abort incomplete merge if necessary
    if ($originalBranch) {
        & git rev-parse -q --verify MERGE_HEAD 2>$null

        if ($LASTEXITCODE -eq 0) {
            Write-Host "Aborting incomplete merge..." -ForegroundColor Yellow
            & git merge --abort
        }
    }
}
finally {
    # Always return to original branch
    if ($originalBranch) {
        Write-Host "`nReturning to $originalBranch..." -ForegroundColor Cyan

        & git switch $originalBranch

        if ($LASTEXITCODE -eq 0) {
            Write-Host "Current branch: $originalBranch" -ForegroundColor Green
        }
        else {
            Write-Host "WARNING: Could not return to $originalBranch. Check git status." -ForegroundColor Red
        }
    }
}
