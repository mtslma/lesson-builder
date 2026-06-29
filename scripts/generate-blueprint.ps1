param(
  [Parameter(Mandatory = $true)]
  [string]$InputJson,

  [Parameter(Mandatory = $true)]
  [string]$OutputMarkdown
)

$ErrorActionPreference = "Stop"

function Add-Line {
  param(
    [System.Collections.Generic.List[string]]$Lines,
    [string]$Text = ""
  )

  $Lines.Add($Text) | Out-Null
}

function Add-SectionTitle {
  param(
    [System.Collections.Generic.List[string]]$Lines,
    [string]$Title
  )

  Add-Line $Lines "## $Title"
  Add-Line $Lines
}

function Add-BlockTitle {
  param(
    [System.Collections.Generic.List[string]]$Lines,
    [string]$Type,
    [string]$Title
  )

  if ([string]::IsNullOrWhiteSpace($Title)) {
    Add-Line $Lines "**[Block: $Type]**"
  } else {
    Add-Line $Lines "**[Block: $Type]** $Title"
  }
}

function Add-KeyValue {
  param(
    [System.Collections.Generic.List[string]]$Lines,
    [string]$Key,
    [string]$Value
  )

  if (-not [string]::IsNullOrWhiteSpace($Value)) {
    Add-Line $Lines "${Key}: $Value"
  }
}

function Add-BulletList {
  param(
    [System.Collections.Generic.List[string]]$Lines,
    [object[]]$Items
  )

  foreach ($item in $Items) {
    if (-not [string]::IsNullOrWhiteSpace([string]$item)) {
      Add-Line $Lines "- $item"
    }
  }
}

function Add-Table {
  param(
    [System.Collections.Generic.List[string]]$Lines,
    [object[]]$Headers,
    [object[]]$Rows
  )

  if (($null -eq $Headers) -or ($Headers.Count -eq 0)) {
    return
  }

  Add-Line $Lines ("| " + (($Headers | ForEach-Object { [string]$_ }) -join " | ") + " |")
  Add-Line $Lines ("| " + (($Headers | ForEach-Object { "---" }) -join " | ") + " |")

  foreach ($row in $Rows) {
    if ($row -is [System.Collections.IEnumerable] -and -not ($row -is [string])) {
      Add-Line $Lines ("| " + (($row | ForEach-Object { [string]$_ }) -join " | ") + " |")
    }
  }
}

function Render-Conversation {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Conversation" $Block.title
  Add-KeyValue $Lines "Layout" $Block.layout
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-KeyValue $Lines "Image" $Block.imageUrl
  Add-Line $Lines

  foreach ($message in $Block.messages) {
    Add-Line $Lines "- $($message.speaker): $($message.text)"
  }

  if ($Block.substitutionBox -and $Block.substitutionBox.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Substitution ideas:"
    foreach ($entry in $Block.substitutionBox) {
      Add-Line $Lines "- Original: $($entry.original)"
      foreach ($alt in $entry.alternatives) {
        Add-Line $Lines "- Alternative: $alt"
      }
    }
  }
}

function Render-Flashcards {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Flashcards" $Block.title
  Add-Line $Lines

  foreach ($card in $Block.cards) {
    $expr = @($card.expressions | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    if ($expr.Count -gt 0) {
      Add-Line $Lines "- Expressions: $($expr -join ' / ')"
    }
    Add-KeyValue $Lines "  Meaning" $card.shortMeaning
    Add-KeyValue $Lines "  Back text" $card.backText
    Add-KeyValue $Lines "  Example" $card.exampleSentence
    Add-KeyValue $Lines "  Translation" $card.translation
  }
}

function Render-Roleplay {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Roleplay" $Block.title
  Add-KeyValue $Lines "Objective" $Block.objective
  Add-KeyValue $Lines "Scenario" $Block.scenario
  Add-KeyValue $Lines "Student A Card" $Block.studentACard
  Add-KeyValue $Lines "Student B Card" $Block.studentBCard
  Add-KeyValue $Lines "Tips" $Block.tips

  if ($Block.customFields -and $Block.customFields.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Custom fields:"
    foreach ($field in $Block.customFields) {
      Add-Line $Lines "- $($field.label): $($field.value)"
    }
  }

  if ($Block.characters -and $Block.characters.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Characters:"
    foreach ($character in $Block.characters) {
      Add-Line $Lines "- $($character.name)"
      foreach ($detail in $character.details) {
        Add-Line $Lines "- $($detail.label): $($detail.value)"
      }
    }
  }
}

function Render-FillBlank {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Fill-blank" $Block.title
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-KeyValue $Lines "Mode" $Block.mode
  Add-Line $Lines
  Add-Line $Lines $Block.text
}

function Render-LetterNumber {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Letter-Number" $Block.title
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-KeyValue $Lines "Variant" $Block.variant
  Add-Line $Lines

  foreach ($item in $Block.items) {
    Add-Line $Lines "- $($item.symbol): $($item.label)"
  }
}

function Render-ConversationPrompts {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Conversation-prompts" $Block.title
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-Line $Lines

  if ($Block.prompts) {
    foreach ($prompt in $Block.prompts) {
      Add-Line $Lines "- $prompt"
    }
  }

  if ($Block.exchanges) {
    foreach ($exchange in $Block.exchanges) {
      $speaker = ($Block.speakers | Where-Object { $_.id -eq $exchange.speakerId } | Select-Object -First 1).name
      if ([string]::IsNullOrWhiteSpace($speaker)) {
        Add-Line $Lines "- $($exchange.text)"
      } else {
        Add-Line $Lines "- ${speaker}: $($exchange.text)"
      }
    }
  }
}

function Render-AdvancedGrammar {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Advanced Grammar" $Block.title
  Add-KeyValue $Lines "Explanation" $Block.explanation
  Add-KeyValue $Lines "Details" $Block.details

  if ($Block.tableHeaders -and $Block.tableRows) {
    Add-Line $Lines
    $rows = @()
    foreach ($row in $Block.tableRows) {
      $cells = @()
      foreach ($cell in $row.cells) {
        $cells += $cell.text
      }
      $rows += ,$cells
    }
    Add-Table $Lines $Block.tableHeaders $rows
  }

  if ($Block.examples -and $Block.examples.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Examples:"
    Add-BulletList $Lines $Block.examples
  }

  if ($Block.commonMistakes -and $Block.commonMistakes.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Common mistakes:"
    Add-BulletList $Lines $Block.commonMistakes
  }

  if ($Block.miniPractice -and $Block.miniPractice.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Mini practice:"
    Add-BulletList $Lines $Block.miniPractice
  }
}

function Render-Paragraph {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Paragraph" ""
  Add-KeyValue $Lines "Style" $Block.style
  Add-Line $Lines $Block.content
}

function Render-Heading {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Heading - $($Block.level)" ""
  Add-Line $Lines $Block.content
}

function Render-TableCompletion {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Table-completion" $Block.title
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-Line $Lines

  $rows = @()
  foreach ($row in $Block.rows) {
    $rows += ,@($row.cells)
  }
  Add-Table $Lines $Block.headers $rows
}

function Render-QuestionSet {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Question-set" $Block.title
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-KeyValue $Lines "Practice mode" $Block.practiceMode
  Add-Line $Lines

  $i = 1
  foreach ($question in $Block.questions) {
    Add-Line $Lines "$i. [$($question.type)] $($question.question)"
    if ($question.options) {
      foreach ($option in $question.options) {
        Add-Line $Lines "- $($option.text)"
      }
    }
    $i++
  }
}

function Render-Listening {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Listening" $Block.title
  Add-KeyValue $Lines "Instruction" $Block.instruction
  Add-KeyValue $Lines "AudioUrl" $Block.audioUrl
  Add-KeyValue $Lines "TranscriptVisibility" $Block.transcriptVisibility
  Add-KeyValue $Lines "Context image" $Block.contextImageUrl

  if ($Block.script -and $Block.script.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Script:"
    foreach ($part in $Block.script) {
      Add-Line $Lines "- $($part.speaker): $($part.text)"
    }
  }

  if ($Block.questions -and $Block.questions.Count -gt 0) {
    Add-Line $Lines
    Add-Line $Lines "Questions:"
    $index = 1
    foreach ($question in $Block.questions) {
      Add-Line $Lines "$index. [$($question.type)] $($question.question)"
      if ($question.options) {
        foreach ($option in $question.options) {
          Add-Line $Lines "- $($option.text)"
        }
      }
      $index++
    }
  }
}

function Render-WritingTask {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines "Writing-task" $Block.title
  Add-KeyValue $Lines "Prompt" $Block.prompt
  if ($Block.minWords) {
    Add-KeyValue $Lines "Minimum words" ([string]$Block.minWords)
  }
}

function Render-GenericBlock {
  param($Block, [System.Collections.Generic.List[string]]$Lines)

  Add-BlockTitle $Lines $Block.type $Block.title

  foreach ($prop in $Block.PSObject.Properties) {
    if ($prop.Name -in @("id", "type", "title", "audience", "pageNumber", "estimatedTime")) {
      continue
    }

    $value = $prop.Value
    if ($value -is [string]) {
      Add-KeyValue $Lines $prop.Name $value
    } elseif ($value -is [System.ValueType]) {
      Add-KeyValue $Lines $prop.Name ([string]$value)
    } elseif ($null -ne $value) {
      $json = $value | ConvertTo-Json -Depth 20 -Compress
      Add-KeyValue $Lines $prop.Name $json
    }
  }
}

$data = Get-Content -Raw $InputJson | ConvertFrom-Json -Depth 100
$lines = New-Object 'System.Collections.Generic.List[string]'

Add-Line $lines "# $($data.title)"
Add-Line $lines
Add-Line $lines "Level: $($data.level) | Language: $($data.language)"
Add-Line $lines

$pages = @()
$currentPage = $null

foreach ($block in $data.blocks) {
  if ($block.type -eq "page-break") {
    $currentPage = [PSCustomObject]@{
      Number = $block.pageNumber
      EstimatedTime = $block.estimatedTime
      Blocks = New-Object 'System.Collections.Generic.List[object]'
    }
    $pages += $currentPage
    continue
  }

  if ($null -eq $currentPage) {
    $currentPage = [PSCustomObject]@{
      Number = 1
      EstimatedTime = ""
      Blocks = New-Object 'System.Collections.Generic.List[object]'
    }
    $pages += $currentPage
  }

  $currentPage.Blocks.Add($block) | Out-Null
}

Add-SectionTitle $lines "Global Scope"
Add-Line $lines "This blueprint is a full text conversion of the source JSON. Keep the lesson content in English for the student-facing parts and preserve the progression, examples, and practice structure below."
Add-Line $lines

foreach ($page in $pages) {
  Add-Line $lines "---"
  Add-Line $lines
  Add-SectionTitle $lines "Page $($page.Number)"
  Add-KeyValue $lines "Estimated time" $page.EstimatedTime
  Add-Line $lines

  foreach ($block in $page.Blocks) {
    switch ($block.type) {
      "heading" { Render-Heading $block $lines }
      "paragraph" { Render-Paragraph $block $lines }
      "conversation" { Render-Conversation $block $lines }
      "flashcards" { Render-Flashcards $block $lines }
      "roleplay" { Render-Roleplay $block $lines }
      "fill-blank" { Render-FillBlank $block $lines }
      "letter-number" { Render-LetterNumber $block $lines }
      "conversation-prompts" { Render-ConversationPrompts $block $lines }
      "advanced-grammar" { Render-AdvancedGrammar $block $lines }
      "table-completion" { Render-TableCompletion $block $lines }
      "question-set" { Render-QuestionSet $block $lines }
      "listening" { Render-Listening $block $lines }
      "writing-task" { Render-WritingTask $block $lines }
      default { Render-GenericBlock $block $lines }
    }

    Add-Line $lines
  }
}

$directory = Split-Path -Parent $OutputMarkdown
if (-not (Test-Path $directory)) {
  New-Item -ItemType Directory -Path $directory | Out-Null
}

[System.IO.File]::WriteAllLines($OutputMarkdown, $lines)
