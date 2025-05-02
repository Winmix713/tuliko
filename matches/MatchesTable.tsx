"use client"

import { memo, useMemo, useState } from "react"
import { Calendar, AlertCircle, Filter, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"
import type { Match } from "../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MatchesTableProps {
  matches: Match[]
}

const MatchScore = memo(
  ({
    homeScore,
    awayScore,
    isHalfTime,
  }: {
    homeScore: number
    awayScore: number
    isHalfTime?: boolean
  }) => {
    const scoreClass = useMemo(() => {
      if (isHalfTime) return "text-gray-400"
      if (homeScore > awayScore) return "text-emerald-400"
      if (homeScore < awayScore) return "text-red-400"
      return "text-amber-400"
    }, [homeScore, awayScore, isHalfTime])

    return (
      <span className={`font-mono font-bold ${scoreClass}`}>
        {homeScore} - {awayScore}
      </span>
    )
  },
)

MatchScore.displayName = "MatchScore"

const MatchCard = memo(({ match }: { match: Match }) => {
  const homeWin = match.home_score > match.away_score
  const awayWin = match.home_score < match.away_score
  const draw = match.home_score === match.away_score

  return (
    <div className="bg-black/30 rounded-lg border border-white/5 p-4 hover:bg-black/40 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">{match.date}</span>
        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
          Round {match.round || "?"}
        </Badge>
      </div>

      <div className="flex items-center justify-between my-3">
        <div className={`text-right flex-1 text-white ${homeWin ? "font-bold" : ""}`}>{match.home_team}</div>

        <div className="mx-4 px-4 py-2 bg-black/30 rounded-lg flex flex-col items-center">
          <div className="text-lg font-bold">
            <MatchScore homeScore={match.home_score} awayScore={match.away_score} />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            HT: <MatchScore homeScore={match.ht_home_score} awayScore={match.ht_away_score} isHalfTime />
          </div>
        </div>

        <div className={`text-left flex-1 text-white ${awayWin ? "font-bold" : ""}`}>{match.away_team}</div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">{homeWin ? "Home Win" : awayWin ? "Away Win" : "Draw"}</div>
        <div className="text-xs text-gray-500">Total Goals: {match.home_score + match.away_score}</div>
      </div>
    </div>
  )
})

MatchCard.displayName = "MatchCard"

const MatchFilters = memo(({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    team: "",
    round: "",
    result: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Filter by team..."
          className="bg-black/30 border-white/10 text-white"
          value={filters.team}
          onChange={(e) => handleFilterChange("team", e.target.value)}
        />
      </div>
      <Select value={filters.round} onValueChange={(value) => handleFilterChange("round", value)}>
        <SelectTrigger className="w-full md:w-[180px] bg-black/30 border-white/10 text-white">
          <SelectValue placeholder="Round" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Rounds</SelectItem>
          <SelectItem value="1">Round 1</SelectItem>
          <SelectItem value="2">Round 2</SelectItem>
          <SelectItem value="3">Round 3</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.result} onValueChange={(value) => handleFilterChange("result", value)}>
        <SelectTrigger className="w-full md:w-[180px] bg-black/30 border-white/10 text-white">
          <SelectValue placeholder="Result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Results</SelectItem>
          <SelectItem value="home">Home Wins</SelectItem>
          <SelectItem value="away">Away Wins</SelectItem>
          <SelectItem value="draw">Draws</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
        onClick={() => {
          setFilters({ team: "", round: "", result: "" })
          onFilterChange({ team: "", round: "", result: "" })
        }}
      >
        Reset
      </Button>
    </div>
  )
})

MatchFilters.displayName = "MatchFilters"

export const MatchesTable = memo(({ matches = [] }: MatchesTableProps) => {
  const [viewType, setViewType] = useState<"rounds" | "all" | "cards">("rounds")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [filters, setFilters] = useState({ team: "", round: "", result: "" })

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const teamMatch = filters.team
        ? match.home_team.toLowerCase().includes(filters.team.toLowerCase()) ||
          match.away_team.toLowerCase().includes(filters.team.toLowerCase())
        : true

      const roundMatch = filters.round ? match.round === filters.round : true

      let resultMatch = true
      if (filters.result === "home") {
        resultMatch = match.home_score > match.away_score
      } else if (filters.result === "away") {
        resultMatch = match.home_score < match.away_score
      } else if (filters.result === "draw") {
        resultMatch = match.home_score === match.away_score
      }

      return teamMatch && roundMatch && resultMatch
    })
  }, [matches, filters])

  const sortedMatches = useMemo(() => {
    if (!sortConfig) return filteredMatches

    return [...filteredMatches].sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }

      if (sortConfig.key === "round") {
        const roundA = Number.parseInt(a.round || "0")
        const roundB = Number.parseInt(b.round || "0")
        return sortConfig.direction === "asc" ? roundA - roundB : roundB - roundA
      }

      if (sortConfig.key === "goals") {
        const goalsA = a.home_score + a.away_score
        const goalsB = b.home_score + b.away_score
        return sortConfig.direction === "asc" ? goalsA - goalsB : goalsB - goalsA
      }

      return 0
    })
  }, [filteredMatches, sortConfig])

  const matchesByRound = useMemo(() => {
    return sortedMatches.reduce(
      (acc, match) => {
        const round = match.round || "Unknown"
        if (!acc[round]) {
          acc[round] = []
        }
        acc[round].push(match)
        return acc
      },
      {} as Record<string, Match[]>,
    )
  }, [sortedMatches])

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  if (matches.length === 0) {
    return (
      <Card className="bg-black/20 border-white/5">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-500" />
            <p className="text-gray-400">No matches available for this league yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-white">Match Schedule</CardTitle>
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0a0f14] border-white/10 text-white">
                <DropdownMenuItem
                  onClick={() => requestSort("date")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  Date {getSortIcon("date")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => requestSort("round")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  Round {getSortIcon("round")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => requestSort("goals")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  Total Goals {getSortIcon("goals")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs
              value={viewType}
              onValueChange={(value) => setViewType(value as "rounds" | "all" | "cards")}
              className="w-auto"
            >
              <TabsList className="bg-black/30 border border-white/10">
                <TabsTrigger value="rounds" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  By Round
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  All Matches
                </TabsTrigger>
                <TabsTrigger value="cards" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Cards
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <MatchFilters onFilterChange={setFilters} />

        {viewType === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {sortedMatches.map((match, index) => (
              <MatchCard key={`${match.home_team}-${match.away_team}-${index}`} match={match} />
            ))}
            {sortedMatches.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400">
                No matches found with the current filters.
              </div>
            )}
          </div>
        ) : viewType === "rounds" ? (
          <div className="space-y-6">
            {Object.entries(matchesByRound).map(([round, roundMatches]) => (
              <div key={round} className="bg-black/30 rounded-xl overflow-hidden border border-white/5">
                <div className="flex items-center gap-2 p-3 bg-black/40">
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                    {round}
                  </span>
                  <h4 className="text-base font-medium text-white">Round {round}</h4>
                  <span className="text-xs text-gray-400 ml-auto">{roundMatches.length} matches</span>
                </div>
                <Table>
                  <TableHeader className="bg-black/20">
                    <TableRow className="border-b border-white/5 hover:bg-transparent">
                      <TableHead className="text-gray-400 font-normal">Date</TableHead>
                      <TableHead className="text-gray-400 font-normal">Home Team</TableHead>
                      <TableHead className="text-gray-400 font-normal">Away Team</TableHead>
                      <TableHead className="text-gray-400 font-normal text-center">HT</TableHead>
                      <TableHead className="text-gray-400 font-normal text-center">FT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roundMatches.map((match, index) => (
                      <TableRow
                        key={`${match.home_team}-${match.away_team}-${index}`}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <TableCell>{match.date}</TableCell>
                        <TableCell
                          className={`font-medium text-white ${match.home_score > match.away_score ? "font-bold" : ""}`}
                        >
                          {match.home_team}
                        </TableCell>
                        <TableCell
                          className={`font-medium text-white ${match.home_score < match.away_score ? "font-bold" : ""}`}
                        >
                          {match.away_team}
                        </TableCell>
                        <TableCell className="text-center">
                          <MatchScore homeScore={match.ht_home_score} awayScore={match.ht_away_score} isHalfTime />
                        </TableCell>
                        <TableCell className="text-center">
                          <MatchScore homeScore={match.home_score} awayScore={match.away_score} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
            {Object.keys(matchesByRound).length === 0 && (
              <div className="text-center py-8 text-white opacity-70">No matches found with the current filters.</div>
            )}
          </div>
        ) : (
          <div className="bg-black/30 rounded-xl overflow-hidden border border-white/5">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-normal">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("round")}
                      className="text-gray-400 font-normal p-0 hover:text-white flex items-center"
                    >
                      Round {getSortIcon("round")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-400 font-normal">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("date")}
                      className="text-gray-400 font-normal p-0 hover:text-white flex items-center"
                    >
                      Date {getSortIcon("date")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-400 font-normal">Home Team</TableHead>
                  <TableHead className="text-gray-400 font-normal">Away Team</TableHead>
                  <TableHead className="text-gray-400 font-normal text-center">HT</TableHead>
                  <TableHead className="text-gray-400 font-normal text-center">FT</TableHead>
                  <TableHead className="text-gray-400 font-normal text-center">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("goals")}
                      className="text-gray-400 font-normal p-0 hover:text-white flex items-center justify-center"
                    >
                      Goals {getSortIcon("goals")}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMatches.map((match, index) => (
                  <TableRow
                    key={`${match.home_team}-${match.away_team}-${index}`}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <TableCell>{match.round}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell
                      className={`font-medium text-white ${match.home_score > match.away_score ? "font-bold" : ""}`}
                    >
                      {match.home_team}
                    </TableCell>
                    <TableCell
                      className={`font-medium text-white ${match.home_score < match.away_score ? "font-bold" : ""}`}
                    >
                      {match.away_team}
                    </TableCell>
                    <TableCell className="text-center">
                      <MatchScore homeScore={match.ht_home_score} awayScore={match.ht_away_score} isHalfTime />
                    </TableCell>
                    <TableCell className="text-center">
                      <MatchScore homeScore={match.home_score} awayScore={match.away_score} />
                    </TableCell>
                    <TableCell className="text-center text-gray-400">{match.home_score + match.away_score}</TableCell>
                  </TableRow>
                ))}
                {sortedMatches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                      No matches found with the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

MatchesTable.displayName = "MatchesTable"

